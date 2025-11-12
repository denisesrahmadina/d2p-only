import { supabase } from './supabaseClient';

export interface Task {
  id: string;
  task_id: string;
  organization_id: string;
  title: string;
  description: string;
  type: 'automated' | 'manual';
  source: string;
  source_event: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'Created' | 'Assigned To' | 'Done' | 'Review for Closure' | 'Re-Open' | 'Closed';
  assigned_to: string;
  assigned_to_type: 'human' | 'ai_agent';
  created_by: string;
  created_date: string;
  last_updated: string;
  due_date: string;
  category: string;
  tags: string[];
  sap_document: {
    documentNumber: string;
    documentType: string;
    [key: string]: any;
  };
}

export class TaskService {
  /**
   * Get all tasks
   */
  static async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_date', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get task by ID
   */
  static async getTaskById(id: string): Promise<Task | undefined> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching task:', error);
      throw error;
    }

    return data || undefined;
  }

  /**
   * Get task by task_id
   */
  static async getTaskByTaskId(taskId: string): Promise<Task | undefined> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('task_id', taskId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching task:', error);
      throw error;
    }

    return data || undefined;
  }

  /**
   * Get tasks by organization ID
   */
  static async getTasksByOrganization(organizationId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_date', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get tasks by status
   */
  static async getTasksByStatus(organizationId: string, status: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', status)
      .order('created_date', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get tasks by assigned to type
   */
  static async getTasksByAssignedToType(organizationId: string, assignedToType: 'human' | 'ai_agent'): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('assigned_to_type', assignedToType)
      .order('created_date', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get tasks by priority
   */
  static async getTasksByPriority(organizationId: string, priority: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('priority', priority)
      .order('created_date', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get tasks by category
   */
  static async getTasksByCategory(organizationId: string, category: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('category', category)
      .order('created_date', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get tasks by type
   */
  static async getTasksByType(organizationId: string, type: 'automated' | 'manual'): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('type', type)
      .order('created_date', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get tasks assigned to specific person/agent
   */
  static async getTasksAssignedTo(organizationId: string, assignedTo: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('assigned_to', assignedTo)
      .order('created_date', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get overdue tasks
   */
  static async getOverdueTasks(organizationId: string): Promise<Task[]> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('organization_id', organizationId)
      .lt('due_date', now)
      .not('status', 'in', '(Closed,Done)')
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching overdue tasks:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get tasks due today
   */
  static async getTasksDueToday(organizationId: string): Promise<Task[]> {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('organization_id', organizationId)
      .gte('due_date', `${today}T00:00:00Z`)
      .lt('due_date', `${today}T23:59:59Z`)
      .not('status', 'in', '(Closed,Done)')
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching tasks due today:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Search tasks
   */
  static async searchTasks(organizationId: string, query: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('organization_id', organizationId)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,assigned_to.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_date', { ascending: false });

    if (error) {
      console.error('Error searching tasks:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get tasks summary
   */
  static async getTasksSummary(organizationId: string): Promise<{
    total: number;
    byStatus: { [status: string]: number };
    byPriority: { [priority: string]: number };
    byCategory: { [category: string]: number };
    byAssignedToType: { human: number; ai_agent: number };
    overdue: number;
    dueToday: number;
  }> {
    const tasks = await this.getTasksByOrganization(organizationId);
    const overdueTasks = await this.getOverdueTasks(organizationId);
    const dueTodayTasks = await this.getTasksDueToday(organizationId);

    const byStatus: { [status: string]: number } = {};
    const byPriority: { [priority: string]: number } = {};
    const byCategory: { [category: string]: number } = {};
    const byAssignedToType = { human: 0, ai_agent: 0 };

    tasks.forEach(task => {
      byStatus[task.status] = (byStatus[task.status] || 0) + 1;
      byPriority[task.priority] = (byPriority[task.priority] || 0) + 1;
      byCategory[task.category] = (byCategory[task.category] || 0) + 1;
      byAssignedToType[task.assigned_to_type]++;
    });

    return {
      total: tasks.length,
      byStatus,
      byPriority,
      byCategory,
      byAssignedToType,
      overdue: overdueTasks.length,
      dueToday: dueTodayTasks.length
    };
  }

  /**
   * Update task status
   */
  static async updateTaskStatus(taskId: string, newStatus: string, updatedBy: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        status: newStatus,
        last_updated: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating task status:', error);
      throw error;
    }

    return data;
  }

  /**
   * Assign task to person/agent
   */
  static async assignTask(taskId: string, assignedTo: string, assignedToType: 'human' | 'ai_agent'): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        assigned_to: assignedTo,
        assigned_to_type: assignedToType,
        status: 'Assigned To',
        last_updated: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error assigning task:', error);
      throw error;
    }

    return data;
  }

  /**
   * Filter tasks by multiple criteria
   */
  static async filterTasks(organizationId: string, filters: {
    status?: string;
    priority?: string;
    category?: string;
    assignedToType?: 'human' | 'ai_agent';
    assignedTo?: string;
    type?: 'automated' | 'manual';
    overdue?: boolean;
    dueToday?: boolean;
    searchTerm?: string;
  }): Promise<Task[]> {
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('organization_id', organizationId);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.assignedToType) {
      query = query.eq('assigned_to_type', filters.assignedToType);
    }

    if (filters.assignedTo) {
      query = query.ilike('assigned_to', `%${filters.assignedTo}%`);
    }

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    if (filters.overdue) {
      const now = new Date().toISOString();
      query = query.lt('due_date', now).not('status', 'in', '(Closed,Done)');
    }

    if (filters.dueToday) {
      const today = new Date().toISOString().split('T')[0];
      query = query
        .gte('due_date', `${today}T00:00:00Z`)
        .lt('due_date', `${today}T23:59:59Z`)
        .not('status', 'in', '(Closed,Done)');
    }

    if (filters.searchTerm) {
      query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%,assigned_to.ilike.%${filters.searchTerm}%,category.ilike.%${filters.searchTerm}%`);
    }

    query = query.order('created_date', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error filtering tasks:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get all unique categories
   */
  static async getCategories(organizationId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('category')
      .eq('organization_id', organizationId);

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    const categories = [...new Set(data.map(item => item.category))].filter(Boolean).sort();
    return categories;
  }

  /**
   * Get all unique assigned to values
   */
  static async getAssignedToValues(organizationId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('assigned_to')
      .eq('organization_id', organizationId);

    if (error) {
      console.error('Error fetching assigned to values:', error);
      throw error;
    }

    const assignedToValues = [...new Set(data.map(item => item.assigned_to))].filter(Boolean).sort();
    return assignedToValues;
  }

  /**
   * Get all unique statuses
   */
  static async getStatuses(): Promise<string[]> {
    return ['Created', 'Assigned To', 'Done', 'Review for Closure', 'Re-Open', 'Closed'];
  }

  /**
   * Get all unique priorities
   */
  static async getPriorities(): Promise<string[]> {
    return ['low', 'medium', 'high', 'critical'];
  }

  /**
   * Get task performance metrics
   */
  static async getTaskPerformanceMetrics(organizationId: string): Promise<{
    avgResolutionTime: number;
    slaCompliance: number;
    automationRate: number;
    humanWorkload: number;
    aiWorkload: number;
    categoryPerformance: { [category: string]: { avgTime: number; slaCompliance: number } };
  }> {
    const tasks = await this.getTasksByOrganization(organizationId);
    const completedTasks = tasks.filter(t => t.status === 'Closed' || t.status === 'Done');

    if (completedTasks.length === 0) {
      return {
        avgResolutionTime: 0,
        slaCompliance: 0,
        automationRate: 0,
        humanWorkload: 0,
        aiWorkload: 0,
        categoryPerformance: {}
      };
    }

    const totalResolutionTime = completedTasks.reduce((sum, task) => {
      const created = new Date(task.created_date);
      const updated = new Date(task.last_updated);
      return sum + (updated.getTime() - created.getTime()) / (1000 * 60 * 60);
    }, 0);
    const avgResolutionTime = totalResolutionTime / completedTasks.length;

    const slaCompliantTasks = completedTasks.filter(task => {
      const completed = new Date(task.last_updated);
      const due = new Date(task.due_date);
      return completed <= due;
    });
    const slaCompliance = (slaCompliantTasks.length / completedTasks.length) * 100;

    const automatedTasks = tasks.filter(t => t.type === 'automated');
    const automationRate = (automatedTasks.length / tasks.length) * 100;

    const humanTasks = tasks.filter(t => t.assigned_to_type === 'human');
    const aiTasks = tasks.filter(t => t.assigned_to_type === 'ai_agent');

    const categoryPerformance: { [category: string]: { avgTime: number; slaCompliance: number } } = {};
    const categories = [...new Set(tasks.map(t => t.category))];

    categories.forEach(category => {
      const categoryTasks = completedTasks.filter(t => t.category === category);
      if (categoryTasks.length > 0) {
        const categoryResolutionTime = categoryTasks.reduce((sum, task) => {
          const created = new Date(task.created_date);
          const updated = new Date(task.last_updated);
          return sum + (updated.getTime() - created.getTime()) / (1000 * 60 * 60);
        }, 0);
        const categoryAvgTime = categoryResolutionTime / categoryTasks.length;

        const categorySlaCompliant = categoryTasks.filter(task => {
          const completed = new Date(task.last_updated);
          const due = new Date(task.due_date);
          return completed <= due;
        });
        const categorySlaCompliance = (categorySlaCompliant.length / categoryTasks.length) * 100;

        categoryPerformance[category] = {
          avgTime: Math.round(categoryAvgTime * 10) / 10,
          slaCompliance: Math.round(categorySlaCompliance * 10) / 10
        };
      }
    });

    return {
      avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
      slaCompliance: Math.round(slaCompliance * 10) / 10,
      automationRate: Math.round(automationRate * 10) / 10,
      humanWorkload: humanTasks.length,
      aiWorkload: aiTasks.length,
      categoryPerformance
    };
  }

  /**
   * Get recent task activities
   */
  static async getRecentTaskActivities(organizationId: string, limit: number = 10): Promise<{
    taskId: string;
    title: string;
    action: string;
    assignedTo: string;
    timestamp: string;
    category: string;
  }[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('organization_id', organizationId)
      .order('last_updated', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent task activities:', error);
      throw error;
    }

    return (data || []).map(task => ({
      taskId: task.id,
      title: task.title,
      action: `Status: ${task.status}`,
      assignedTo: task.assigned_to,
      timestamp: task.last_updated,
      category: task.category
    }));
  }

  /**
   * Get task trends over time
   */
  static async getTaskTrends(organizationId: string, days: number = 7): Promise<{
    date: string;
    created: number;
    completed: number;
    automated: number;
    manual: number;
  }[]> {
    const tasks = await this.getTasksByOrganization(organizationId);
    const trends: { [date: string]: any } = {};

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      trends[dateStr] = { date: dateStr, created: 0, completed: 0, automated: 0, manual: 0 };
    }

    tasks.forEach(task => {
      const createdDate = new Date(task.created_date).toISOString().split('T')[0];
      const updatedDate = new Date(task.last_updated).toISOString().split('T')[0];

      if (trends[createdDate]) {
        trends[createdDate].created++;
        if (task.type === 'automated') {
          trends[createdDate].automated++;
        } else {
          trends[createdDate].manual++;
        }
      }

      if (trends[updatedDate] && (task.status === 'Closed' || task.status === 'Done')) {
        trends[updatedDate].completed++;
      }
    });

    return Object.values(trends);
  }

  /**
   * Create new task
   */
  static async createTask(taskData: Omit<Task, 'id' | 'created_date' | 'last_updated'>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        ...taskData,
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update task
   */
  static async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...updates,
        last_updated: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }

    return data;
  }

  /**
   * Delete task
   */
  static async deleteTask(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }

    return true;
  }
}
