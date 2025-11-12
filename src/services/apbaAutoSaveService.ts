import { supabase } from './supabaseClient';

export interface AutoSaveResult {
  success: boolean;
  error?: string;
  revisionId?: number;
}

export interface RevisionHistory {
  revision_id: number;
  ba_id: number;
  ba_number: string;
  revision_number: number;
  content_snapshot: string;
  changed_by: string;
  change_type: 'autosave' | 'manual_save' | 'submission' | 'approval';
  change_summary: string | null;
  created_date: string;
}

class APBAAutoSaveService {
  private autoSaveTimers: Map<number, NodeJS.Timeout> = new Map();
  private readonly AUTO_SAVE_INTERVAL = 30000; // 30 seconds

  /**
   * Start auto-save for a specific document
   */
  startAutoSave(
    baId: number,
    getContent: () => string,
    onSaveStart: () => void,
    onSaveSuccess: (date: Date) => void,
    onSaveError: (error: string) => void
  ): void {
    // Clear existing timer if any
    this.stopAutoSave(baId);

    // Set up new auto-save timer
    const timer = setInterval(async () => {
      try {
        onSaveStart();
        const content = getContent();

        if (!content || content.trim().length === 0) {
          return; // Don't save empty content
        }

        const result = await this.saveAutoSave(baId, content);

        if (result.success) {
          onSaveSuccess(new Date());
        } else {
          onSaveError(result.error || 'Unknown error');
        }
      } catch (error: any) {
        onSaveError(error.message || 'Auto-save failed');
      }
    }, this.AUTO_SAVE_INTERVAL);

    this.autoSaveTimers.set(baId, timer);
  }

  /**
   * Stop auto-save for a specific document
   */
  stopAutoSave(baId: number): void {
    const timer = this.autoSaveTimers.get(baId);
    if (timer) {
      clearInterval(timer);
      this.autoSaveTimers.delete(baId);
    }
  }

  /**
   * Save auto-save content to database
   */
  async saveAutoSave(baId: number, content: string, userId: string = 'current_user'): Promise<AutoSaveResult> {
    try {
      // Update the main document with autosave content
      const { error: updateError } = await supabase
        .from('dim_berita_acara')
        .update({
          autosave_content: content,
          last_autosave_date: new Date().toISOString(),
          modified_date: new Date().toISOString()
        })
        .eq('ba_id', baId);

      if (updateError) {
        throw updateError;
      }

      // Get document info for revision
      const { data: baData, error: fetchError } = await supabase
        .from('dim_berita_acara')
        .select('ba_number')
        .eq('ba_id', baId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Get latest revision number
      const { data: latestRevision } = await supabase
        .from('ba_revision_history')
        .select('revision_number')
        .eq('ba_id', baId)
        .order('revision_number', { ascending: false })
        .limit(1)
        .single();

      const nextRevisionNumber = latestRevision ? latestRevision.revision_number + 1 : 1;

      // Create revision history entry
      const { data: revisionData, error: revisionError } = await supabase
        .from('ba_revision_history')
        .insert([{
          ba_id: baId,
          ba_number: baData.ba_number,
          revision_number: nextRevisionNumber,
          content_snapshot: content,
          changed_by: userId,
          change_type: 'autosave',
          change_summary: 'Auto-save'
        }])
        .select()
        .single();

      if (revisionError) {
        console.error('Failed to create revision:', revisionError);
        // Don't fail the entire save if revision creation fails
      }

      return {
        success: true,
        revisionId: revisionData?.revision_id
      };
    } catch (error: any) {
      console.error('Auto-save error:', error);
      return {
        success: false,
        error: error.message || 'Failed to auto-save'
      };
    }
  }

  /**
   * Manually save document content
   */
  async saveManual(
    baId: number,
    content: string,
    userId: string = 'current_user',
    changeSummary: string = 'Manual save'
  ): Promise<AutoSaveResult> {
    try {
      // Update the main document
      const { error: updateError } = await supabase
        .from('dim_berita_acara')
        .update({
          ba_content: content,
          autosave_content: content,
          modified_date: new Date().toISOString(),
          last_autosave_date: new Date().toISOString()
        })
        .eq('ba_id', baId);

      if (updateError) {
        throw updateError;
      }

      // Get document info
      const { data: baData, error: fetchError } = await supabase
        .from('dim_berita_acara')
        .select('ba_number')
        .eq('ba_id', baId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Get latest revision number
      const { data: latestRevision } = await supabase
        .from('ba_revision_history')
        .select('revision_number')
        .eq('ba_id', baId)
        .order('revision_number', { ascending: false })
        .limit(1)
        .single();

      const nextRevisionNumber = latestRevision ? latestRevision.revision_number + 1 : 1;

      // Create revision history entry
      const { data: revisionData, error: revisionError } = await supabase
        .from('ba_revision_history')
        .insert([{
          ba_id: baId,
          ba_number: baData.ba_number,
          revision_number: nextRevisionNumber,
          content_snapshot: content,
          changed_by: userId,
          change_type: 'manual_save',
          change_summary: changeSummary
        }])
        .select()
        .single();

      if (revisionError) {
        throw revisionError;
      }

      return {
        success: true,
        revisionId: revisionData.revision_id
      };
    } catch (error: any) {
      console.error('Manual save error:', error);
      return {
        success: false,
        error: error.message || 'Failed to save'
      };
    }
  }

  /**
   * Get revision history for a document
   */
  async getRevisionHistory(baId: number): Promise<RevisionHistory[]> {
    try {
      const { data, error } = await supabase
        .from('ba_revision_history')
        .select('*')
        .eq('ba_id', baId)
        .order('created_date', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch revision history:', error);
      return [];
    }
  }

  /**
   * Restore content from a specific revision
   */
  async restoreFromRevision(baId: number, revisionId: number, userId: string = 'current_user'): Promise<AutoSaveResult> {
    try {
      // Get the revision
      const { data: revision, error: revisionError } = await supabase
        .from('ba_revision_history')
        .select('*')
        .eq('revision_id', revisionId)
        .single();

      if (revisionError || !revision) {
        throw new Error('Revision not found');
      }

      // Save as manual save with restore note
      return await this.saveManual(
        baId,
        revision.content_snapshot,
        userId,
        `Restored from revision #${revision.revision_number}`
      );
    } catch (error: any) {
      console.error('Failed to restore revision:', error);
      return {
        success: false,
        error: error.message || 'Failed to restore revision'
      };
    }
  }

  /**
   * Get the latest auto-saved content
   */
  async getAutoSavedContent(baId: number): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('dim_berita_acara')
        .select('autosave_content, last_autosave_date')
        .eq('ba_id', baId)
        .single();

      if (error) {
        throw error;
      }

      return data?.autosave_content || null;
    } catch (error) {
      console.error('Failed to fetch auto-saved content:', error);
      return null;
    }
  }

  /**
   * Clean up all auto-save timers (call on unmount)
   */
  cleanup(): void {
    this.autoSaveTimers.forEach((timer) => clearInterval(timer));
    this.autoSaveTimers.clear();
  }
}

export const apbaAutoSaveService = new APBAAutoSaveService();
