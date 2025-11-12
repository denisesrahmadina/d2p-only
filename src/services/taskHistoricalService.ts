import { supabase } from './supabaseClient';

export interface TaskHistoricalChange {
  id: string;
  history_id: string;
  task_id: string;
  timestamp: string;
  from_status: string | null;
  to_status: string;
  changed_by: string;
  changed_by_type: 'human' | 'ai_agent' | 'system';
  reason: string;
  notes: string;
  assigned_to: string | null;
  assigned_to_type: 'human' | 'ai_agent' | null;
  priority: string;
  category: string;
  created_at: string;
}

export class TaskHistoricalService {
  /**
   * Get all task historical changes
   */
  static async getTaskHistoricalChanges(): Promise<TaskHistoricalChange[]> {
    const { data, error } = await supabase
      .from('task_historical')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching task historical changes:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get historical changes by task ID
   */
  static async getHistoricalChangesByTaskId(taskId: string): Promise<TaskHistoricalChange[]> {
    const { data, error } = await supabase
      .from('task_historical')
      .select('*')
      .eq('task_id', taskId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching historical changes:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get historical changes by changed by
   */
  static async getHistoricalChangesByChangedBy(changedBy: string): Promise<TaskHistoricalChange[]> {
    const { data, error } = await supabase
      .from('task_historical')
      .select('*')
      .ilike('changed_by', `%${changedBy}%`)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching historical changes:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get historical changes by changed by type
   */
  static async getHistoricalChangesByChangedByType(changedByType: 'human' | 'ai_agent' | 'system'): Promise<TaskHistoricalChange[]> {
    const { data, error } = await supabase
      .from('task_historical')
      .select('*')
      .eq('changed_by_type', changedByType)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching historical changes:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get historical changes by status transition
   */
  static async getHistoricalChangesByStatusTransition(fromStatus: string | null, toStatus: string): Promise<TaskHistoricalChange[]> {
    let query = supabase
      .from('task_historical')
      .select('*')
      .eq('to_status', toStatus)
      .order('timestamp', { ascending: false });

    if (fromStatus === null) {
      query = query.is('from_status', null);
    } else {
      query = query.eq('from_status', fromStatus);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching historical changes:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get historical changes by category
   */
  static async getHistoricalChangesByCategory(category: string): Promise<TaskHistoricalChange[]> {
    const { data, error } = await supabase
      .from('task_historical')
      .select('*')
      .ilike('category', `%${category}%`)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching historical changes:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get historical changes by date range
   */
  static async getHistoricalChangesByDateRange(startDate: string, endDate: string): Promise<TaskHistoricalChange[]> {
    const { data, error } = await supabase
      .from('task_historical')
      .select('*')
      .gte('timestamp', startDate)
      .lte('timestamp', endDate)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching historical changes:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get recent historical changes (last N items)
   */
  static async getRecentHistoricalChanges(limit: number = 20): Promise<TaskHistoricalChange[]> {
    const { data, error } = await supabase
      .from('task_historical')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent historical changes:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get task lifecycle summary
   */
  static async getTaskLifecycleSummary(taskId: string): Promise<{
    taskId: string;
    totalChanges: number;
    createdDate: string;
    lastModified: string;
    currentStatus: string;
    totalDuration: number;
    statusHistory: string[];
    assignmentHistory: { assigned_to: string; assigned_to_type: string; timestamp: string }[];
    humanInteractions: number;
    aiInteractions: number;
    systemInteractions: number;
  } | null> {
    const changes = await this.getHistoricalChangesByTaskId(taskId);

    if (changes.length === 0) return null;

    const sortedChanges = changes.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const createdDate = sortedChanges[0].timestamp;
    const lastModified = sortedChanges[sortedChanges.length - 1].timestamp;
    const currentStatus = sortedChanges[sortedChanges.length - 1].to_status;

    const totalDuration = (new Date(lastModified).getTime() - new Date(createdDate).getTime()) / (1000 * 60 * 60);

    const statusHistory = [...new Set(sortedChanges.map(change => change.to_status))];

    const assignmentHistory = sortedChanges
      .filter(change => change.assigned_to && change.assigned_to_type)
      .map(change => ({
        assigned_to: change.assigned_to!,
        assigned_to_type: change.assigned_to_type!,
        timestamp: change.timestamp
      }));

    const humanInteractions = changes.filter(c => c.changed_by_type === 'human').length;
    const aiInteractions = changes.filter(c => c.changed_by_type === 'ai_agent').length;
    const systemInteractions = changes.filter(c => c.changed_by_type === 'system').length;

    return {
      taskId,
      totalChanges: changes.length,
      createdDate,
      lastModified,
      currentStatus,
      totalDuration: Math.round(totalDuration * 10) / 10,
      statusHistory,
      assignmentHistory,
      humanInteractions,
      aiInteractions,
      systemInteractions
    };
  }

  /**
   * Get status transition analytics
   */
  static async getStatusTransitionAnalytics(): Promise<{
    transition: string;
    from_status: string | null;
    to_status: string;
    count: number;
    avgDuration: number;
    humanChanges: number;
    aiChanges: number;
    systemChanges: number;
  }[]> {
    const changes = await this.getTaskHistoricalChanges();
    const transitionMap = new Map<string, TaskHistoricalChange[]>();

    changes.forEach(change => {
      const transition = `${change.from_status || 'New'} → ${change.to_status}`;
      if (!transitionMap.has(transition)) {
        transitionMap.set(transition, []);
      }
      transitionMap.get(transition)!.push(change);
    });

    const analytics = Array.from(transitionMap.entries()).map(([transition, transitionChanges]) => {
      const durations: number[] = [];

      transitionChanges.forEach(change => {
        const previousChange = changes
          .filter(c => c.task_id === change.task_id && new Date(c.timestamp) < new Date(change.timestamp))
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

        if (previousChange) {
          const duration = (new Date(change.timestamp).getTime() - new Date(previousChange.timestamp).getTime()) / (1000 * 60 * 60);
          durations.push(duration);
        }
      });

      const avgDuration = durations.length > 0
        ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length
        : 0;

      const firstChange = transitionChanges[0];

      return {
        transition,
        from_status: firstChange.from_status,
        to_status: firstChange.to_status,
        count: transitionChanges.length,
        avgDuration: Math.round(avgDuration * 10) / 10,
        humanChanges: transitionChanges.filter(c => c.changed_by_type === 'human').length,
        aiChanges: transitionChanges.filter(c => c.changed_by_type === 'ai_agent').length,
        systemChanges: transitionChanges.filter(c => c.changed_by_type === 'system').length
      };
    });

    return analytics.sort((a, b) => b.count - a.count);
  }

  /**
   * Get user activity summary
   */
  static async getUserActivitySummary(): Promise<{
    user: string;
    userType: 'human' | 'ai_agent' | 'system';
    totalChanges: number;
    tasksAffected: number;
    avgChangesPerTask: number;
    lastActivity: string;
    categoriesWorked: string[];
  }[]> {
    const changes = await this.getTaskHistoricalChanges();
    const userMap = new Map<string, TaskHistoricalChange[]>();

    changes.forEach(change => {
      if (!userMap.has(change.changed_by)) {
        userMap.set(change.changed_by, []);
      }
      userMap.get(change.changed_by)!.push(change);
    });

    return Array.from(userMap.entries()).map(([user, userChanges]) => {
      const uniqueTasks = new Set(userChanges.map(c => c.task_id));
      const uniqueCategories = new Set(userChanges.map(c => c.category));
      const latestChange = userChanges.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

      return {
        user,
        userType: latestChange.changed_by_type,
        totalChanges: userChanges.length,
        tasksAffected: uniqueTasks.size,
        avgChangesPerTask: Math.round((userChanges.length / uniqueTasks.size) * 10) / 10,
        lastActivity: latestChange.timestamp,
        categoriesWorked: Array.from(uniqueCategories)
      };
    }).sort((a, b) => b.totalChanges - a.totalChanges);
  }

  /**
   * Search historical changes
   */
  static async searchHistoricalChanges(query: string): Promise<TaskHistoricalChange[]> {
    const { data, error } = await supabase
      .from('task_historical')
      .select('*')
      .or(`task_id.ilike.%${query}%,changed_by.ilike.%${query}%,reason.ilike.%${query}%,notes.ilike.%${query}%,to_status.ilike.%${query}%,from_status.ilike.%${query}%,category.ilike.%${query}%`)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error searching historical changes:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Filter historical changes by multiple criteria
   */
  static async filterHistoricalChanges(filters: {
    taskId?: string;
    changedBy?: string;
    changedByType?: 'human' | 'ai_agent' | 'system';
    fromStatus?: string;
    toStatus?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    searchTerm?: string;
  }): Promise<TaskHistoricalChange[]> {
    let query = supabase.from('task_historical').select('*');

    if (filters.taskId) {
      query = query.eq('task_id', filters.taskId);
    }

    if (filters.changedBy) {
      query = query.ilike('changed_by', `%${filters.changedBy}%`);
    }

    if (filters.changedByType) {
      query = query.eq('changed_by_type', filters.changedByType);
    }

    if (filters.fromStatus !== undefined) {
      if (filters.fromStatus === null) {
        query = query.is('from_status', null);
      } else {
        query = query.eq('from_status', filters.fromStatus);
      }
    }

    if (filters.toStatus) {
      query = query.eq('to_status', filters.toStatus);
    }

    if (filters.category) {
      query = query.ilike('category', `%${filters.category}%`);
    }

    if (filters.dateFrom) {
      query = query.gte('timestamp', filters.dateFrom);
    }

    if (filters.dateTo) {
      query = query.lte('timestamp', filters.dateTo);
    }

    query = query.order('timestamp', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error filtering historical changes:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get historical changes statistics
   */
  static async getHistoricalChangesStatistics(): Promise<{
    totalChanges: number;
    totalTasks: number;
    avgChangesPerTask: number;
    changesByType: { [type: string]: number };
    changesByCategory: { [category: string]: number };
    changesByStatus: { [status: string]: number };
    mostActiveUsers: { user: string; changes: number }[];
  }> {
    const changes = await this.getTaskHistoricalChanges();

    if (changes.length === 0) {
      return {
        totalChanges: 0,
        totalTasks: 0,
        avgChangesPerTask: 0,
        changesByType: {},
        changesByCategory: {},
        changesByStatus: {},
        mostActiveUsers: []
      };
    }

    const uniqueTasks = new Set(changes.map(c => c.task_id));

    const changesByType: { [type: string]: number } = {};
    changes.forEach(change => {
      changesByType[change.changed_by_type] = (changesByType[change.changed_by_type] || 0) + 1;
    });

    const changesByCategory: { [category: string]: number } = {};
    changes.forEach(change => {
      changesByCategory[change.category] = (changesByCategory[change.category] || 0) + 1;
    });

    const changesByStatus: { [status: string]: number } = {};
    changes.forEach(change => {
      changesByStatus[change.to_status] = (changesByStatus[change.to_status] || 0) + 1;
    });

    const userActivity = new Map<string, number>();
    changes.forEach(change => {
      userActivity.set(change.changed_by, (userActivity.get(change.changed_by) || 0) + 1);
    });

    const mostActiveUsers = Array.from(userActivity.entries())
      .map(([user, changes]) => ({ user, changes }))
      .sort((a, b) => b.changes - a.changes)
      .slice(0, 10);

    return {
      totalChanges: changes.length,
      totalTasks: uniqueTasks.size,
      avgChangesPerTask: Math.round((changes.length / uniqueTasks.size) * 10) / 10,
      changesByType,
      changesByCategory,
      changesByStatus,
      mostActiveUsers
    };
  }

  /**
   * Get task status flow for a specific task
   */
  static async getTaskStatusFlow(taskId: string): Promise<{
    taskId: string;
    statusFlow: {
      status: string;
      timestamp: string;
      changed_by: string;
      changed_by_type: string;
      duration: number | null;
      notes: string;
    }[];
    totalLifetime: number;
  } | null> {
    const changes = await this.getHistoricalChangesByTaskId(taskId);

    if (changes.length === 0) return null;

    const sortedChanges = changes.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const statusFlow = sortedChanges.map((change, index) => {
      let duration: number | null = null;

      if (index < sortedChanges.length - 1) {
        const nextChange = sortedChanges[index + 1];
        duration = (new Date(nextChange.timestamp).getTime() - new Date(change.timestamp).getTime()) / (1000 * 60 * 60);
        duration = Math.round(duration * 10) / 10;
      }

      return {
        status: change.to_status,
        timestamp: change.timestamp,
        changed_by: change.changed_by,
        changed_by_type: change.changed_by_type,
        duration,
        notes: change.notes
      };
    });

    const totalLifetime = (new Date(sortedChanges[sortedChanges.length - 1].timestamp).getTime() -
      new Date(sortedChanges[0].timestamp).getTime()) / (1000 * 60 * 60);

    return {
      taskId,
      statusFlow,
      totalLifetime: Math.round(totalLifetime * 10) / 10
    };
  }

  /**
   * Get automation vs manual changes ratio
   */
  static async getAutomationRatio(): Promise<{
    totalChanges: number;
    automatedChanges: number;
    manualChanges: number;
    systemChanges: number;
    automationRate: number;
    manualRate: number;
    systemRate: number;
  }> {
    const changes = await this.getTaskHistoricalChanges();

    const automatedChanges = changes.filter(c => c.changed_by_type === 'ai_agent').length;
    const manualChanges = changes.filter(c => c.changed_by_type === 'human').length;
    const systemChanges = changes.filter(c => c.changed_by_type === 'system').length;

    const total = changes.length;

    return {
      totalChanges: total,
      automatedChanges,
      manualChanges,
      systemChanges,
      automationRate: total > 0 ? Math.round((automatedChanges / total) * 100 * 10) / 10 : 0,
      manualRate: total > 0 ? Math.round((manualChanges / total) * 100 * 10) / 10 : 0,
      systemRate: total > 0 ? Math.round((systemChanges / total) * 100 * 10) / 10 : 0
    };
  }

  /**
   * Create new historical change entry
   */
  static async createHistoricalChange(changeData: Omit<TaskHistoricalChange, 'id' | 'history_id' | 'timestamp' | 'created_at'>): Promise<TaskHistoricalChange> {
    const { data, error } = await supabase
      .from('task_historical')
      .insert([{
        ...changeData,
        history_id: `hist-${Date.now()}`,
        timestamp: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating historical change:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get all unique statuses from historical data
   */
  static async getAllStatuses(): Promise<string[]> {
    const { data, error } = await supabase
      .from('task_historical')
      .select('from_status, to_status');

    if (error) {
      console.error('Error fetching statuses:', error);
      throw error;
    }

    const statuses = new Set<string>();
    data.forEach(item => {
      if (item.from_status) statuses.add(item.from_status);
      statuses.add(item.to_status);
    });

    return Array.from(statuses).sort();
  }

  /**
   * Get all unique categories from historical data
   */
  static async getAllCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('task_historical')
      .select('category');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return [...new Set(data.map(item => item.category))].filter(Boolean).sort();
  }

  /**
   * Get all unique users from historical data
   */
  static async getAllUsers(): Promise<string[]> {
    const { data, error } = await supabase
      .from('task_historical')
      .select('changed_by');

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return [...new Set(data.map(item => item.changed_by))].filter(Boolean).sort();
  }
}
