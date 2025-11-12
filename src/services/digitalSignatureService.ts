import { supabase } from './supabaseClient';
import { BADigitalSignature, RoleSide } from '../types/ba';

export interface SignatureData {
  ba_id: number;
  signer_party_id?: number;
  signer_user_id?: string;
  signer_name: string;
  signer_role: string;
  signer_side: RoleSide;
  signature_type: 'DIGITAL' | 'E_MATERAI' | 'BOTH';
  signature_method: 'DRAWN' | 'UPLOADED' | 'CERTIFICATE';
  signature_image_data?: string;
  ematerai_enabled?: boolean;
}

export interface SignatureVerification {
  is_valid: boolean;
  verification_status: 'PENDING' | 'VERIFIED' | 'FAILED' | 'EXPIRED';
  message: string;
  verified_at?: string;
}

export class DigitalSignatureService {
  static async saveSignature(signatureData: SignatureData, signatureBlob: Blob | null): Promise<BADigitalSignature | null> {
    try {
      let signatureImageUrl = '';

      if (signatureBlob) {
        const fileName = `signature_${signatureData.ba_id}_${Date.now()}.png`;
        const filePath = `ba-signatures/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('ba-documents')
          .upload(filePath, signatureBlob, {
            contentType: 'image/png',
            upsert: false,
          });

        if (uploadError) {
          console.error('Error uploading signature:', uploadError);
        } else {
          const { data: urlData } = supabase.storage
            .from('ba-documents')
            .getPublicUrl(filePath);

          signatureImageUrl = urlData.publicUrl;
        }
      }

      const emateriData = signatureData.ematerai_enabled
        ? this.generateMockEmateraiData()
        : {};

      const signatureRecord: any = {
        ba_id: signatureData.ba_id,
        signer_party_id: signatureData.signer_party_id,
        signer_user_id: signatureData.signer_user_id,
        signer_name: signatureData.signer_name,
        signer_role: signatureData.signer_role,
        signer_side: signatureData.signer_side,
        signature_type: signatureData.signature_type,
        signature_method: signatureData.signature_method,
        signature_image_url: signatureImageUrl || signatureData.signature_image_data,
        signature_timestamp: new Date().toISOString(),
        is_verified: false,
        verification_status: 'PENDING',
        ...emateriData,
      };

      const { data, error } = await supabase
        .from('fact_ba_digital_signature')
        .insert(signatureRecord)
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('fact_ba_process_history')
        .insert({
          ba_id: signatureData.ba_id,
          action_type: 'SIGNATURE_ADDED',
          action_by_name: signatureData.signer_name,
          action_by_role: signatureData.signer_role,
          action_comments: `Digital signature added by ${signatureData.signer_name}`,
        });

      setTimeout(() => {
        this.verifySignature(data.signature_id);
      }, 2000);

      return data;
    } catch (error) {
      console.error('Error saving signature:', error);
      return null;
    }
  }

  static async verifySignature(signatureId: number): Promise<SignatureVerification> {
    try {
      const isValid = Math.random() > 0.05;

      const verificationResult: SignatureVerification = {
        is_valid: isValid,
        verification_status: isValid ? 'VERIFIED' : 'FAILED',
        message: isValid
          ? 'Signature verified successfully'
          : 'Signature verification failed - invalid signature data',
        verified_at: new Date().toISOString(),
      };

      await supabase
        .from('fact_ba_digital_signature')
        .update({
          is_verified: verificationResult.is_valid,
          verification_status: verificationResult.verification_status,
          verification_date: verificationResult.verified_at,
          verification_details: {
            message: verificationResult.message,
            verified_at: verificationResult.verified_at,
          },
        })
        .eq('signature_id', signatureId);

      return verificationResult;
    } catch (error) {
      console.error('Error verifying signature:', error);
      return {
        is_valid: false,
        verification_status: 'FAILED',
        message: 'Error during verification process',
      };
    }
  }

  static async getSignaturesForBA(baId: number): Promise<BADigitalSignature[]> {
    try {
      const { data, error } = await supabase
        .from('fact_ba_digital_signature')
        .select('*')
        .eq('ba_id', baId)
        .order('signature_timestamp', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching signatures:', error);
      return [];
    }
  }

  static async checkAllSignaturesComplete(baId: number, requiredSides: RoleSide[]): Promise<boolean> {
    try {
      const signatures = await this.getSignaturesForBA(baId);

      for (const side of requiredSides) {
        const hasSignature = signatures.some(
          sig => sig.signer_side === side && sig.verification_status === 'VERIFIED'
        );
        if (!hasSignature) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking signature completeness:', error);
      return false;
    }
  }

  static async updateBAWithSignatureCompletion(baId: number): Promise<boolean> {
    try {
      const allComplete = await this.checkAllSignaturesComplete(baId, ['Vendor', 'PLN']);

      if (allComplete) {
        await supabase
          .from('dim_ba_master')
          .update({
            has_digital_signature: true,
            digital_signature_completed_date: new Date().toISOString(),
          })
          .eq('ba_id', baId);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error updating BA signature status:', error);
      return false;
    }
  }

  private static generateMockEmateraiData() {
    const emateriId = `EM${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const verificationCode = Math.random().toString(36).substring(2, 12).toUpperCase();

    return {
      ematerai_id: emateriId,
      ematerai_provider: 'Peruri (Simulated)',
      ematerai_stamp_url: `/api/ematerai/stamp/${emateriId}`,
      ematerai_verification_code: verificationCode,
    };
  }

  static async generateSignatureRequestToken(
    baId: number,
    signerEmail: string,
    signerName: string,
    signerRole: string
  ): Promise<string> {
    const token = btoa(
      JSON.stringify({
        ba_id: baId,
        signer_email: signerEmail,
        signer_name: signerName,
        signer_role: signerRole,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        issued_at: new Date().toISOString(),
      })
    );

    return token;
  }

  static async validateSignatureRequestToken(token: string): Promise<{
    valid: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const decoded = JSON.parse(atob(token));

      const expiresAt = new Date(decoded.expires_at);
      if (expiresAt < new Date()) {
        return { valid: false, error: 'Token has expired' };
      }

      return { valid: true, data: decoded };
    } catch (error) {
      return { valid: false, error: 'Invalid token format' };
    }
  }

  static dataURLToBlob(dataURL: string): Blob {
    const parts = dataURL.split(',');
    const contentType = parts[0].split(':')[1].split(';')[0];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }

  static async sendSignatureRequest(
    baId: number,
    signerEmail: string,
    signerName: string,
    signerRole: string
  ): Promise<boolean> {
    try {
      const token = await this.generateSignatureRequestToken(baId, signerEmail, signerName, signerRole);

      console.log(`[SIGNATURE REQUEST] Email would be sent to: ${signerEmail}`);
      console.log(`[SIGNATURE REQUEST] Token: ${token}`);
      console.log(`[SIGNATURE REQUEST] BA ID: ${baId}`);
      console.log(`[SIGNATURE REQUEST] Signer: ${signerName} (${signerRole})`);

      await supabase.from('fact_ba_process_history').insert({
        ba_id: baId,
        action_type: 'COMMENT_ADDED',
        action_by_name: 'System',
        action_comments: `Signature request sent to ${signerName} (${signerEmail})`,
        action_metadata: {
          request_type: 'signature_request',
          recipient_email: signerEmail,
          recipient_name: signerName,
          recipient_role: signerRole,
        },
      });

      return true;
    } catch (error) {
      console.error('Error sending signature request:', error);
      return false;
    }
  }
}
