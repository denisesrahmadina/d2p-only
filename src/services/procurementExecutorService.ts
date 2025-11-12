import { supabase } from './supabaseClient';

export interface ProcurementExecutor {
  id: string;
  name: string;
  email: string;
  department: string;
  current_workload: number;
  max_capacity: number;
  availability_status: 'Available' | 'Not Available';
  specialization: string[];
  organization_id: string;
  created_at?: string;
}

export class ProcurementExecutorService {
  static async getAllExecutors(organizationId: string): Promise<ProcurementExecutor[]> {
    const { data, error } = await supabase
      .from('ref_procurement_executor')
      .select('*')
      .eq('organization_id', organizationId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getAvailableExecutors(organizationId: string): Promise<ProcurementExecutor[]> {
    const { data, error } = await supabase
      .from('ref_procurement_executor')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('availability_status', 'Available')
      .order('current_workload', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getExecutorById(id: string): Promise<ProcurementExecutor | null> {
    const { data, error } = await supabase
      .from('ref_procurement_executor')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async updateExecutorWorkload(
    executorId: string,
    increment: number
  ): Promise<ProcurementExecutor> {
    const executor = await this.getExecutorById(executorId);
    if (!executor) {
      throw new Error('Executor not found');
    }

    const newWorkload = Math.max(0, executor.current_workload + increment);
    const newAvailability = newWorkload >= executor.max_capacity ? 'Not Available' : 'Available';

    const { data, error } = await supabase
      .from('ref_procurement_executor')
      .update({
        current_workload: newWorkload,
        availability_status: newAvailability
      })
      .eq('id', executorId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async autoAssignExecutor(
    organizationId: string,
    category?: string
  ): Promise<ProcurementExecutor | null> {
    const availableExecutors = await this.getAvailableExecutors(organizationId);

    if (availableExecutors.length === 0) {
      return null;
    }

    let bestExecutor = availableExecutors[0];
    let bestScore = 0;

    for (const executor of availableExecutors) {
      let score = 0;

      const workloadScore = (executor.max_capacity - executor.current_workload) / executor.max_capacity;
      score += workloadScore * 0.6;

      if (category && executor.specialization) {
        const categoryLower = category.toLowerCase();
        const hasSpecialization = executor.specialization.some(spec =>
          spec.toLowerCase().includes(categoryLower) || categoryLower.includes(spec.toLowerCase())
        );
        if (hasSpecialization) {
          score += 0.4;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestExecutor = executor;
      }
    }

    return bestExecutor;
  }

  static async incrementWorkload(executorId: string): Promise<void> {
    await this.updateExecutorWorkload(executorId, 1);
  }

  static async decrementWorkload(executorId: string): Promise<void> {
    await this.updateExecutorWorkload(executorId, -1);
  }
}
