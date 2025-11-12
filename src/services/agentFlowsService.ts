import agentFlowsData from '../data/agentFlows.json';

export interface AgentFlowData {
  agentId: string;
  name: string;
  description: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  coordinationPattern: string;
  benefits: string;
  subAgents?: Record<string, SubAgent>;
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string };
  style?: Record<string, any>;
  sourcePosition?: string | string[];
  targetPosition?: string | string[];
  agentType: string;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  animated?: boolean;
  markerEnd?: {
    type: string;
    color: string;
  };
}

export interface SubAgent {
  llm: {
    primary: string;
    model: string;
    temperature: number;
  };
  prompt: string;
  tools: string[];
}

export class AgentFlowsService {
  /**
   * Get all agent flows
   */
  static async getAgentFlows(): Promise<AgentFlowData[]> {
    // In the future, this could be replaced with an API call
    return agentFlowsData as AgentFlowData[];
  }

  /**
   * Get flow by agent ID
   */
  static async getFlowByAgentId(agentId: string): Promise<AgentFlowData | undefined> {
    const flows = await this.getAgentFlows();
    return flows.find(flow => flow.agentId === agentId);
  }

  /**
   * Get flows by coordination pattern
   */
  static async getFlowsByPattern(pattern: string): Promise<AgentFlowData[]> {
    const flows = await this.getAgentFlows();
    return flows.filter(flow => 
      flow.coordinationPattern.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  /**
   * Get all coordination patterns
   */
  static async getCoordinationPatterns(): Promise<string[]> {
    const flows = await this.getAgentFlows();
    return [...new Set(flows.map(flow => flow.coordinationPattern))];
  }

  /**
   * Get sub-agents for a specific agent
   */
  static async getSubAgentsByAgentId(agentId: string): Promise<Record<string, SubAgent> | undefined> {
    const flow = await this.getFlowByAgentId(agentId);
    return flow?.subAgents;
  }

  /**
   * Get flow statistics
   */
  static async getFlowStatistics() {
    const flows = await this.getAgentFlows();
    const totalFlows = flows.length;
    const avgNodesPerFlow = flows.reduce((sum, flow) => sum + flow.nodes.length, 0) / totalFlows;
    const avgEdgesPerFlow = flows.reduce((sum, flow) => sum + flow.edges.length, 0) / totalFlows;
    const patterns = await this.getCoordinationPatterns();

    return {
      totalFlows,
      avgNodesPerFlow: Math.round(avgNodesPerFlow * 10) / 10,
      avgEdgesPerFlow: Math.round(avgEdgesPerFlow * 10) / 10,
      uniquePatterns: patterns.length,
      patterns
    };
  }
}