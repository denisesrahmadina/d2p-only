import { Agent, AgentOutput } from '../types/agent';
import { supabase } from './index';

interface DbAgent {
  id: string;
  agent_id: string;
  organization_id: string;
  department_id: string;
  name: string;
  goals: string | null;
  description: string | null;
  icon: string | null;
  color: string | null;
  capabilities: any;
  business_benefit: string | null;
  status: string;
  last_updated: string | null;
  llm: any;
  prompt: any;
  tools: any;
  ai_app_url: string | null;
  agentflow_id: string | null;
  agentflow_url: string | null;
  created_at: string;
  updated_at: string;
}

function mapDbAgentToAgent(dbAgent: DbAgent): Agent {
  return {
    id: dbAgent.agent_id,
    organizationId: dbAgent.organization_id,
    departmentId: dbAgent.department_id,
    name: dbAgent.name,
    goals: dbAgent.goals || '',
    description: dbAgent.description || '',
    icon: dbAgent.icon || '',
    color: dbAgent.color || '',
    capabilities: Array.isArray(dbAgent.capabilities) ? dbAgent.capabilities : [],
    businessBenefit: dbAgent.business_benefit || '',
    status: dbAgent.status as any,
    metrics: {
      responseTime: 0,
      uptime: 0,
      tasksCompleted: 0,
      errorRate: 0
    },
    lastUpdated: dbAgent.last_updated || '',
    llm: dbAgent.llm || {},
    prompt: dbAgent.prompt || {},
    tools: Array.isArray(dbAgent.tools) ? dbAgent.tools : [],
    aiAppURL: dbAgent.ai_app_url,
    agentflowId: dbAgent.agentflow_id || undefined,
    agentflowUrl: dbAgent.agentflow_url || undefined
  };
}

function mapAgentToDbAgent(agent: Partial<Agent>): Partial<DbAgent> {
  const dbAgent: Partial<DbAgent> = {};

  if (agent.id !== undefined) dbAgent.agent_id = agent.id;
  if (agent.organizationId !== undefined) dbAgent.organization_id = agent.organizationId;
  if (agent.departmentId !== undefined) dbAgent.department_id = agent.departmentId;
  if (agent.name !== undefined) dbAgent.name = agent.name;
  if (agent.goals !== undefined) dbAgent.goals = agent.goals;
  if (agent.description !== undefined) dbAgent.description = agent.description;
  if (agent.icon !== undefined) dbAgent.icon = agent.icon;
  if (agent.color !== undefined) dbAgent.color = agent.color;
  if (agent.capabilities !== undefined) dbAgent.capabilities = agent.capabilities;
  if (agent.businessBenefit !== undefined) dbAgent.business_benefit = agent.businessBenefit;
  if (agent.status !== undefined) dbAgent.status = agent.status;
  if (agent.lastUpdated !== undefined) dbAgent.last_updated = agent.lastUpdated;
  if (agent.llm !== undefined) dbAgent.llm = agent.llm;
  if (agent.prompt !== undefined) dbAgent.prompt = agent.prompt;
  if (agent.tools !== undefined) dbAgent.tools = agent.tools;
  if (agent.aiAppURL !== undefined) dbAgent.ai_app_url = agent.aiAppURL;
  if (agent.agentflowId !== undefined) dbAgent.agentflow_id = agent.agentflowId;
  if (agent.agentflowUrl !== undefined) dbAgent.agentflow_url = agent.agentflowUrl;

  return dbAgent;
}

export class AgentDataService {
  /**
   * Get all agents
   */
  static async getAgents(): Promise<Agent[]> {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching agents:', error);
      return [];
    }

    return (data || []).map(mapDbAgentToAgent);
  }

  /**
   * Get agent by ID (agent_id)
   */
  static async getAgentById(id: string): Promise<Agent | undefined> {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('agent_id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching agent:', error);
      return undefined;
    }

    return data ? mapDbAgentToAgent(data) : undefined;
  }

  /**
   * Get agents by status
   */
  static async getAgentsByStatus(status: string): Promise<Agent[]> {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('status', status)
      .order('name');

    if (error) {
      console.error('Error fetching agents by status:', error);
      return [];
    }

    return (data || []).map(mapDbAgentToAgent);
  }

  /**
   * Get agents by department ID
   */
  static async getAgentsByDepartment(departmentId: string): Promise<Agent[]> {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('department_id', departmentId)
      .order('name');

    if (error) {
      console.error('Error fetching agents by department:', error);
      return [];
    }

    return (data || []).map(mapDbAgentToAgent);
  }

  /**
   * Update agent status
   */
  static async updateAgentStatus(agentId: string, status: string): Promise<Agent | null> {
    const { data, error } = await supabase
      .from('agents')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('agent_id', agentId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating agent status:', error);
      return null;
    }

    return data ? mapDbAgentToAgent(data) : null;
  }

  /**
   * Create agent
   */
  static async createAgent(agent: Omit<Agent, 'metrics'>): Promise<Agent | null> {
    const dbAgent = mapAgentToDbAgent(agent);

    const { data, error } = await supabase
      .from('agents')
      .insert(dbAgent)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating agent:', error);
      return null;
    }

    return data ? mapDbAgentToAgent(data) : null;
  }

  /**
   * Update agent
   */
  static async updateAgent(agentId: string, updates: Partial<Agent>): Promise<Agent | null> {
    const dbUpdates = mapAgentToDbAgent(updates);
    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('agents')
      .update(dbUpdates)
      .eq('agent_id', agentId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating agent:', error);
      return null;
    }

    return data ? mapDbAgentToAgent(data) : null;
  }

  /**
   * Delete agent
   */
  static async deleteAgent(agentId: string): Promise<boolean> {
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('agent_id', agentId);

    if (error) {
      console.error('Error deleting agent:', error);
      return false;
    }

    return true;
  }

  /**
   * Get agent metrics summary
   */
  static async getAgentMetricsSummary() {
    const agents = await this.getAgents();
    const activeAgents = agents.filter(agent => agent.status === 'active').length;
    const totalTasks = agents.reduce((sum, agent) => sum + agent.metrics.tasksCompleted, 0);
    const avgUptime = agents.reduce((sum, agent) => sum + agent.metrics.uptime, 0) / agents.length;
    const avgErrorRate = agents.reduce((sum, agent) => sum + agent.metrics.errorRate, 0) / agents.length;

    return {
      activeAgents,
      totalTasks,
      avgUptime: Math.round(avgUptime * 10) / 10,
      avgErrorRate: Math.round(avgErrorRate * 10) / 10
    };
  }
}