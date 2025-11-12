import { supabase } from './supabaseClient';

interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    organizationId: string;
    departmentId: string;
    role: string;
    department: string;
    permissions: string[];
    lastLogin: string;
  };
  error?: string;
}

interface PasswordChangeResult {
  success: boolean;
  error?: string;
}

export class AuthService {
  static async login(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('🔐 [AuthService] Attempting login for:', email);

      const { data, error } = await supabase.rpc('authenticate_user', {
        user_email: email,
        user_password: password
      });

      if (error) {
        console.error('❌ [AuthService] Database error:', error);
        return {
          success: false,
          error: 'Authentication failed. Please try again.'
        };
      }

      if (!data || data.length === 0) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      const result = data[0];

      if (!result.success) {
        return {
          success: false,
          error: result.error_message || 'Invalid email or password'
        };
      }

      console.log('✅ [AuthService] Authentication successful');

      return {
        success: true,
        user: result.user_data
      };
    } catch (error: any) {
      console.error('❌ [AuthService] Exception:', error);
      return {
        success: false,
        error: error.message || 'Login failed. Please try again.'
      };
    }
  }

  static async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ): Promise<PasswordChangeResult> {
    try {
      console.log('🔒 [AuthService] Changing password for:', email);

      const { data, error } = await supabase.rpc('change_user_password', {
        user_email: email,
        old_password: oldPassword,
        new_password: newPassword
      });

      if (error) {
        console.error('❌ [AuthService] Password change error:', error);
        return {
          success: false,
          error: 'Failed to change password. Please try again.'
        };
      }

      if (!data || data.length === 0) {
        return {
          success: false,
          error: 'Password change failed'
        };
      }

      const result = data[0];

      if (!result.success) {
        return {
          success: false,
          error: result.error_message || 'Failed to change password'
        };
      }

      console.log('✅ [AuthService] Password changed successfully');

      return {
        success: true
      };
    } catch (error: any) {
      console.error('❌ [AuthService] Exception:', error);
      return {
        success: false,
        error: error.message || 'Password change failed'
      };
    }
  }

  static async resetPassword(
    email: string,
    newPassword: string
  ): Promise<PasswordChangeResult> {
    try {
      console.log('🔓 [AuthService] Resetting password for:', email);

      const { data, error } = await supabase.rpc('reset_user_password', {
        user_email: email,
        new_password: newPassword
      });

      if (error) {
        console.error('❌ [AuthService] Password reset error:', error);
        return {
          success: false,
          error: 'Failed to reset password. Please try again.'
        };
      }

      if (!data || data.length === 0) {
        return {
          success: false,
          error: 'Password reset failed'
        };
      }

      const result = data[0];

      if (!result.success) {
        return {
          success: false,
          error: result.error_message || 'Failed to reset password'
        };
      }

      console.log('✅ [AuthService] Password reset successfully');

      return {
        success: true
      };
    } catch (error: any) {
      console.error('❌ [AuthService] Exception:', error);
      return {
        success: false,
        error: error.message || 'Password reset failed'
      };
    }
  }

  static async verifySession(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ [AuthService] Session verification error:', error);
      return false;
    }
  }
}
