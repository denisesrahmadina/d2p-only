export interface Agent {
  id: string;
  departmentId: string;
  name: string;
  goals: string;
  description: string;
  icon: string;
  color: string;
  capabilities: string[];
  businessBenefit: string;
  status: AgentStatus;
  metrics: AgentMetrics;
  lastUpdated: string;
  aiAppURL?: string;
  agentflowId?: string;
  agentflowUrl?: string;
  llm: {
    primary: string;
    fallback: string;
    model: string;
    temperature: number;
    maxTokens: number;
  };
  prompt: {
    systemPrompt: string;
    instructions: string[];
  };
  tools: string[];
}

export interface AgentMetrics {
  responseTime: number;
  uptime: number;
  tasksCompleted: number;
  errorRate: number;
}

export type AgentStatus = 'active' | 'idle' | 'error' | 'maintenance';

export interface AgentOutput {
  id: string;
  agentId: string;
  title: string;
  type: 'alert' | 'insight' | 'recommendation' | 'report';
  severity: 'low' | 'medium' | 'high' | 'critical';
  content: string;
  data: any;
  timestamp: string;
  actionRequired: boolean;
}

export interface MCPTool {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
}

export interface Organization {
  id: string;
  industryId: string;
  name: string;
  type: 'holding' | 'subsidiary';
  parentId?: string;
  kpis: KPI[];
}

export interface KPI {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  target: number;
}

export interface User {
  id: string;
  organizationId: string;
  departmentId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  permissions: string[];
  lastLogin: string;
}