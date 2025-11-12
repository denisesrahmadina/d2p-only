import { supabase } from './supabaseClient';

export interface EditingSession {
  session_id: string;
  ba_id: number;
  user_id: string;
  user_name: string;
  user_email: string | null;
  cursor_position: number;
  selected_range: { start: number; end: number };
  is_active: boolean;
  last_heartbeat: string;
  session_started: string;
  session_ended: string | null;
}

export interface DocumentLockInfo {
  is_locked: boolean;
  locked_by: string | null;
  lock_acquired_at: string | null;
}

class APBACollaborationService {
  private heartbeatTimers: Map<string, NodeJS.Timeout> = new Map();
  private readonly HEARTBEAT_INTERVAL = 15000; // 15 seconds
  private readonly SESSION_TIMEOUT = 3600000; // 1 hour

  /**
   * Create a new editing session
   */
  async createSession(
    baId: number,
    userId: string,
    userName: string,
    userEmail: string | null = null
  ): Promise<string | null> {
    try {
      const sessionId = `session_${baId}_${userId}_${Date.now()}`;

      const { error } = await supabase
        .from('ba_editing_sessions')
        .insert([{
          session_id: sessionId,
          ba_id: baId,
          user_id: userId,
          user_name: userName,
          user_email: userEmail,
          cursor_position: 0,
          selected_range: { start: 0, end: 0 },
          is_active: true,
          last_heartbeat: new Date().toISOString(),
          session_started: new Date().toISOString()
        }]);

      if (error) {
        console.error('Failed to create session:', error);
        return null;
      }

      // Start heartbeat for this session
      this.startHeartbeat(sessionId);

      return sessionId;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  }

  /**
   * Start heartbeat for a session
   */
  private startHeartbeat(sessionId: string): void {
    // Clear existing heartbeat if any
    this.stopHeartbeat(sessionId);

    const timer = setInterval(async () => {
      try {
        await this.sendHeartbeat(sessionId);
      } catch (error) {
        console.error('Heartbeat failed:', error);
      }
    }, this.HEARTBEAT_INTERVAL);

    this.heartbeatTimers.set(sessionId, timer);
  }

  /**
   * Stop heartbeat for a session
   */
  private stopHeartbeat(sessionId: string): void {
    const timer = this.heartbeatTimers.get(sessionId);
    if (timer) {
      clearInterval(timer);
      this.heartbeatTimers.delete(sessionId);
    }
  }

  /**
   * Send heartbeat to keep session alive
   */
  async sendHeartbeat(sessionId: string, cursorPosition?: number): Promise<void> {
    try {
      const updateData: any = {
        last_heartbeat: new Date().toISOString(),
        is_active: true
      };

      if (cursorPosition !== undefined) {
        updateData.cursor_position = cursorPosition;
      }

      const { error } = await supabase
        .from('ba_editing_sessions')
        .update(updateData)
        .eq('session_id', sessionId);

      if (error) {
        console.error('Heartbeat update failed:', error);
      }
    } catch (error) {
      console.error('Error sending heartbeat:', error);
    }
  }

  /**
   * End an editing session
   */
  async endSession(sessionId: string): Promise<void> {
    try {
      this.stopHeartbeat(sessionId);

      const { error } = await supabase
        .from('ba_editing_sessions')
        .update({
          is_active: false,
          session_ended: new Date().toISOString()
        })
        .eq('session_id', sessionId);

      if (error) {
        console.error('Failed to end session:', error);
      }
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }

  /**
   * Get active editing sessions for a document
   */
  async getActiveSessions(baId: number): Promise<EditingSession[]> {
    try {
      // First, clean up stale sessions
      await this.cleanupStaleSessions(baId);

      const { data, error } = await supabase
        .from('ba_editing_sessions')
        .select('*')
        .eq('ba_id', baId)
        .eq('is_active', true)
        .order('session_started', { ascending: false });

      if (error) {
        console.error('Failed to fetch active sessions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting active sessions:', error);
      return [];
    }
  }

  /**
   * Clean up stale sessions (inactive for more than 1 hour)
   */
  async cleanupStaleSessions(baId?: number): Promise<void> {
    try {
      const oneHourAgo = new Date(Date.now() - this.SESSION_TIMEOUT).toISOString();

      let query = supabase
        .from('ba_editing_sessions')
        .update({
          is_active: false,
          session_ended: new Date().toISOString()
        })
        .eq('is_active', true)
        .lt('last_heartbeat', oneHourAgo);

      if (baId !== undefined) {
        query = query.eq('ba_id', baId);
      }

      const { error } = await query;

      if (error) {
        console.error('Failed to cleanup stale sessions:', error);
      }
    } catch (error) {
      console.error('Error cleaning up stale sessions:', error);
    }
  }

  /**
   * Subscribe to session changes for real-time collaboration
   */
  subscribeToSessions(baId: number, callback: (sessions: EditingSession[]) => void): () => void {
    const channel = supabase
      .channel(`ba_sessions_${baId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ba_editing_sessions',
          filter: `ba_id=eq.${baId}`
        },
        async () => {
          // Fetch updated sessions when changes occur
          const sessions = await this.getActiveSessions(baId);
          callback(sessions);
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Acquire document lock
   */
  async acquireLock(baId: number, userId: string, userName: string): Promise<boolean> {
    try {
      // Check if document is already locked
      const { data: currentDoc, error: fetchError } = await supabase
        .from('dim_berita_acara')
        .select('is_locked, locked_by, lock_acquired_at')
        .eq('ba_id', baId)
        .single();

      if (fetchError) {
        console.error('Failed to fetch document lock status:', fetchError);
        return false;
      }

      // If locked by someone else and lock is not expired
      if (currentDoc.is_locked && currentDoc.locked_by !== userId) {
        const lockAge = Date.now() - new Date(currentDoc.lock_acquired_at).getTime();
        if (lockAge < 30 * 60 * 1000) { // 30 minutes
          return false;
        }
      }

      // Acquire lock
      const { error: lockError } = await supabase
        .from('dim_berita_acara')
        .update({
          is_locked: true,
          locked_by: userName,
          lock_acquired_at: new Date().toISOString()
        })
        .eq('ba_id', baId);

      if (lockError) {
        console.error('Failed to acquire lock:', lockError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error acquiring lock:', error);
      return false;
    }
  }

  /**
   * Release document lock
   */
  async releaseLock(baId: number, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('dim_berita_acara')
        .update({
          is_locked: false,
          locked_by: null,
          lock_acquired_at: null
        })
        .eq('ba_id', baId);

      if (error) {
        console.error('Failed to release lock:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error releasing lock:', error);
      return false;
    }
  }

  /**
   * Get document lock information
   */
  async getLockInfo(baId: number): Promise<DocumentLockInfo | null> {
    try {
      const { data, error } = await supabase
        .from('dim_berita_acara')
        .select('is_locked, locked_by, lock_acquired_at')
        .eq('ba_id', baId)
        .single();

      if (error) {
        console.error('Failed to fetch lock info:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting lock info:', error);
      return null;
    }
  }

  /**
   * Auto-unlock expired document locks
   */
  async autoUnlockExpired(): Promise<void> {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

      const { error } = await supabase
        .from('dim_berita_acara')
        .update({
          is_locked: false,
          locked_by: null,
          lock_acquired_at: null
        })
        .eq('is_locked', true)
        .lt('lock_acquired_at', thirtyMinutesAgo);

      if (error) {
        console.error('Failed to auto-unlock expired documents:', error);
      }
    } catch (error) {
      console.error('Error auto-unlocking expired documents:', error);
    }
  }

  /**
   * Subscribe to document lock changes
   */
  subscribeToLockChanges(baId: number, callback: (lockInfo: DocumentLockInfo) => void): () => void {
    const channel = supabase
      .channel(`ba_lock_${baId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'dim_berita_acara',
          filter: `ba_id=eq.${baId}`
        },
        async (payload: any) => {
          const lockInfo: DocumentLockInfo = {
            is_locked: payload.new.is_locked,
            locked_by: payload.new.locked_by,
            lock_acquired_at: payload.new.lock_acquired_at
          };
          callback(lockInfo);
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Clean up all timers and subscriptions
   */
  cleanup(): void {
    this.heartbeatTimers.forEach((timer) => clearInterval(timer));
    this.heartbeatTimers.clear();
  }
}

export const apbaCollaborationService = new APBACollaborationService();
