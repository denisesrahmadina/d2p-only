import { supabase } from './supabaseClient';

export interface TenderScore {
  id: string;
  tender_id: string;
  vendor_id: string;
  criteria_name: string;
  ai_score?: number;
  manual_score?: number;
  weight: number;
  justification?: string;
  scored_by?: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface VendorTotalScore {
  vendor_id: string;
  total_score: number;
  weighted_score: number;
  criteria_scores: TenderScore[];
}

export class TenderScoringService {
  static async getAllScores(organizationId: string): Promise<TenderScore[]> {
    const { data, error } = await supabase
      .from('fact_tender_scoring')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getScoreById(id: string): Promise<TenderScore | null> {
    const { data, error } = await supabase
      .from('fact_tender_scoring')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getScoresByTender(tenderId: string): Promise<TenderScore[]> {
    const { data, error } = await supabase
      .from('fact_tender_scoring')
      .select('*')
      .eq('tender_id', tenderId)
      .order('vendor_id', { ascending: true })
      .order('criteria_name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getScoresByVendor(vendorId: string): Promise<TenderScore[]> {
    const { data, error } = await supabase
      .from('fact_tender_scoring')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getScoresByTenderAndVendor(
    tenderId: string,
    vendorId: string
  ): Promise<TenderScore[]> {
    const { data, error } = await supabase
      .from('fact_tender_scoring')
      .select('*')
      .eq('tender_id', tenderId)
      .eq('vendor_id', vendorId)
      .order('criteria_name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createScore(
    score: Omit<TenderScore, 'id' | 'created_at' | 'updated_at'>
  ): Promise<TenderScore> {
    const { data, error } = await supabase
      .from('fact_tender_scoring')
      .insert([score])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateScore(
    id: string,
    updates: Partial<TenderScore>
  ): Promise<TenderScore> {
    const { data, error } = await supabase
      .from('fact_tender_scoring')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async upsertScore(
    tenderId: string,
    vendorId: string,
    criteriaName: string,
    score: Partial<TenderScore>
  ): Promise<TenderScore> {
    const { data, error } = await supabase
      .from('fact_tender_scoring')
      .upsert([{
        tender_id: tenderId,
        vendor_id: vendorId,
        criteria_name: criteriaName,
        ...score,
        updated_at: new Date().toISOString()
      }], {
        onConflict: 'tender_id,vendor_id,criteria_name'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteScore(id: string): Promise<void> {
    const { error } = await supabase
      .from('fact_tender_scoring')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async calculateVendorTotalScores(tenderId: string): Promise<VendorTotalScore[]> {
    const scores = await this.getScoresByTender(tenderId);

    const vendorScoresMap = new Map<string, TenderScore[]>();
    scores.forEach(score => {
      if (!vendorScoresMap.has(score.vendor_id)) {
        vendorScoresMap.set(score.vendor_id, []);
      }
      vendorScoresMap.get(score.vendor_id)!.push(score);
    });

    const vendorTotalScores: VendorTotalScore[] = [];
    vendorScoresMap.forEach((criteriaScores, vendorId) => {
      const finalScores = criteriaScores.map(s => s.manual_score !== null && s.manual_score !== undefined ? s.manual_score : s.ai_score || 0);
      const weights = criteriaScores.map(s => s.weight);

      const totalScore = finalScores.reduce((sum, score) => sum + score, 0);
      const weightedScore = finalScores.reduce((sum, score, idx) => sum + (score * weights[idx]), 0);

      vendorTotalScores.push({
        vendor_id: vendorId,
        total_score: Math.round(totalScore * 100) / 100,
        weighted_score: Math.round(weightedScore * 100) / 100,
        criteria_scores: criteriaScores
      });
    });

    return vendorTotalScores.sort((a, b) => b.weighted_score - a.weighted_score);
  }

  static async getWinningVendor(tenderId: string): Promise<VendorTotalScore | null> {
    const scores = await this.calculateVendorTotalScores(tenderId);
    return scores.length > 0 ? scores[0] : null;
  }

  static async batchCreateScores(
    scores: Omit<TenderScore, 'id' | 'created_at' | 'updated_at'>[]
  ): Promise<TenderScore[]> {
    const { data, error } = await supabase
      .from('fact_tender_scoring')
      .insert(scores)
      .select();

    if (error) throw error;
    return data || [];
  }
}
