import subAgentOutputsData from '../data/subAgentOutputs.json';

export interface SubAgentOutput {
  id: string;
  fromSubAgent: string;
  fromAgentId: string;
  sentTo: string;
  outputType: string;
  timestamp: string;
  title: string;
  content: string;
  data?: any;
  options?: SubAgentOption[];
}

export interface SubAgentOption {
  id: string;
  title: string;
  description: string;
  impact: string;
  cost: string;
  timeframe: string;
  risk: string;
  recommendation: string;
}

export class SubAgentOutputsService {
  /**
   * Get all sub-agent outputs
   */
  static async getSubAgentOutputs(): Promise<SubAgentOutput[]> {
    return subAgentOutputsData as SubAgentOutput[];
  }

  /**
   * Get output by ID
   */
  static async getOutputById(id: string): Promise<SubAgentOutput | undefined> {
    const outputs = await this.getSubAgentOutputs();
    return outputs.find(output => output.id === id);
  }

  /**
   * Get outputs from a specific sub-agent
   */
  static async getOutputsFromSubAgent(subAgentName: string): Promise<SubAgentOutput[]> {
    const outputs = await this.getSubAgentOutputs();
    return outputs.filter(output => output.fromSubAgent === subAgentName);
  }

  /**
   * Get outputs sent to a specific sub-agent or user proxy
   */
  static async getOutputsSentTo(targetAgent: string): Promise<SubAgentOutput[]> {
    const outputs = await this.getSubAgentOutputs();
    return outputs.filter(output => output.sentTo === targetAgent);
  }

  /**
   * Get outputs by parent agent ID
   */
  static async getOutputsByAgentId(agentId: string): Promise<SubAgentOutput[]> {
    const outputs = await this.getSubAgentOutputs();
    return outputs.filter(output => output.fromAgentId === agentId);
  }

  /**
   * Get outputs by output type
   */
  static async getOutputsByType(outputType: string): Promise<SubAgentOutput[]> {
    const outputs = await this.getSubAgentOutputs();
    return outputs.filter(output => output.outputType === outputType);
  }

  /**
   * Get outputs sent to user proxy agents (those with options)
   */
  static async getOutputsForUserProxy(userProxyAgentIds?: string[]): Promise<SubAgentOutput[]> {
    const outputs = await this.getSubAgentOutputs();
    
    if (userProxyAgentIds && userProxyAgentIds.length > 0) {
      return outputs.filter(output => 
        userProxyAgentIds.includes(output.sentTo) && 
        output.options && output.options.length > 0
      );
    }
    
    // Fallback to name-based filtering if no agent IDs provided
    return outputs.filter(output => 
      output.sentTo.includes('user-proxy') && 
      output.options && output.options.length > 0
    );
  }

  /**
   * Get outputs sent to user proxy by agent ID
   */
  static async getOutputsForUserProxyByAgent(agentId: string, userProxyAgentIds?: string[]): Promise<SubAgentOutput[]> {
    const outputs = await this.getSubAgentOutputs();
    
    if (userProxyAgentIds && userProxyAgentIds.length > 0) {
      return outputs.filter(output => 
        output.fromAgentId === agentId &&
        userProxyAgentIds.includes(output.sentTo) && 
        output.options && output.options.length > 0
      );
    }
    
    // Fallback to name-based filtering if no agent IDs provided
    return outputs.filter(output => 
      output.fromAgentId === agentId &&
      output.sentTo.includes('user-proxy') && 
      output.options && output.options.length > 0
    );
  }

  /**
   * Get communication flow for a specific agent
   */
  static async getAgentCommunicationFlow(agentId: string): Promise<{
    agentId: string;
    communicationChain: SubAgentOutput[];
    userProxyDecisions: SubAgentOutput[];
  }> {
    const outputs = await this.getOutputsByAgentId(agentId);
    
    // Sort by timestamp to show communication flow
    const communicationChain = outputs
      .filter(output => !output.sentTo.includes('user-proxy'))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    const userProxyDecisions = outputs
      .filter(output => output.sentTo.includes('user-proxy'))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return {
      agentId,
      communicationChain,
      userProxyDecisions
    };
  }

  /**
   * Get sub-agent communication network
   */
  static async getSubAgentNetwork(agentId: string): Promise<{
    nodes: { id: string; name: string; type: 'sub-agent' | 'user-proxy' }[];
    edges: { from: string; to: string; outputType: string; hasOptions: boolean }[];
  }> {
    const outputs = await this.getOutputsByAgentId(agentId);
    
    // Extract unique nodes
    const nodeSet = new Set<string>();
    outputs.forEach(output => {
      nodeSet.add(output.fromSubAgent);
      nodeSet.add(output.sentTo);
    });
    
    const nodes = Array.from(nodeSet).map(nodeId => ({
      id: nodeId,
      name: nodeId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      type: nodeId.includes('user-proxy') ? 'user-proxy' as const : 'sub-agent' as const
    }));
    
    // Create edges
    const edges = outputs.map(output => ({
      from: output.fromSubAgent,
      to: output.sentTo,
      outputType: output.outputType,
      hasOptions: !!(output.options && output.options.length > 0)
    }));

    return { nodes, edges };
  }

  /**
   * Get recent outputs (last N items)
   */
  static async getRecentOutputs(limit: number = 10): Promise<SubAgentOutput[]> {
    const outputs = await this.getSubAgentOutputs();
    return outputs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * Get recent outputs by agent
   */
  static async getRecentOutputsByAgent(agentId: string, limit: number = 5): Promise<SubAgentOutput[]> {
    const outputs = await this.getOutputsByAgentId(agentId);
    return outputs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * Search outputs by content
   */
  static async searchOutputs(query: string): Promise<SubAgentOutput[]> {
    const outputs = await this.getSubAgentOutputs();
    const lowerQuery = query.toLowerCase();
    return outputs.filter(output => 
      output.title.toLowerCase().includes(lowerQuery) ||
      output.content.toLowerCase().includes(lowerQuery) ||
      output.fromSubAgent.toLowerCase().includes(lowerQuery) ||
      output.sentTo.toLowerCase().includes(lowerQuery) ||
      output.outputType.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get outputs by date range
   */
  static async getOutputsByDateRange(startDate: string, endDate: string): Promise<SubAgentOutput[]> {
    const outputs = await this.getSubAgentOutputs();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return outputs.filter(output => {
      const outputDate = new Date(output.timestamp);
      return outputDate >= start && outputDate <= end;
    });
  }

  /**
   * Get sub-agent performance metrics
   */
  static async getSubAgentMetrics(agentId: string): Promise<{
    totalOutputs: number;
    outputsBySubAgent: { [subAgent: string]: number };
    outputsByType: { [type: string]: number };
    userProxyInteractions: number;
    avgOutputsPerDay: number;
  }> {
    const outputs = await this.getOutputsByAgentId(agentId);
    
    // Count outputs by sub-agent
    const outputsBySubAgent: { [subAgent: string]: number } = {};
    outputs.forEach(output => {
      outputsBySubAgent[output.fromSubAgent] = (outputsBySubAgent[output.fromSubAgent] || 0) + 1;
    });
    
    // Count outputs by type
    const outputsByType: { [type: string]: number } = {};
    outputs.forEach(output => {
      outputsByType[output.outputType] = (outputsByType[output.outputType] || 0) + 1;
    });
    
    // Count user proxy interactions
    const userProxyInteractions = outputs.filter(output => 
      output.sentTo.includes('user-proxy')
    ).length;
    
    // Calculate average outputs per day (assuming data spans multiple days)
    const dates = [...new Set(outputs.map(output => output.timestamp.split('T')[0]))];
    const avgOutputsPerDay = dates.length > 0 ? outputs.length / dates.length : 0;

    return {
      totalOutputs: outputs.length,
      outputsBySubAgent,
      outputsByType,
      userProxyInteractions,
      avgOutputsPerDay: Math.round(avgOutputsPerDay * 10) / 10
    };
  }

  /**
   * Filter outputs by multiple criteria
   */
  static async filterOutputs(filters: {
    agentId?: string;
    fromSubAgent?: string;
    sentTo?: string;
    outputType?: string;
    hasOptions?: boolean;
    dateFrom?: string;
    dateTo?: string;
    searchTerm?: string;
  }): Promise<SubAgentOutput[]> {
    let outputs = await this.getSubAgentOutputs();

    if (filters.agentId) {
      outputs = outputs.filter(output => output.fromAgentId === filters.agentId);
    }

    if (filters.fromSubAgent) {
      outputs = outputs.filter(output => output.fromSubAgent === filters.fromSubAgent);
    }

    if (filters.sentTo) {
      outputs = outputs.filter(output => output.sentTo === filters.sentTo);
    }

    if (filters.outputType) {
      outputs = outputs.filter(output => output.outputType === filters.outputType);
    }

    if (filters.hasOptions !== undefined) {
      outputs = outputs.filter(output => 
        filters.hasOptions ? (output.options && output.options.length > 0) : !output.options
      );
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      outputs = outputs.filter(output => new Date(output.timestamp) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      outputs = outputs.filter(output => new Date(output.timestamp) <= toDate);
    }

    if (filters.searchTerm) {
      const lowerQuery = filters.searchTerm.toLowerCase();
      outputs = outputs.filter(output => 
        output.title.toLowerCase().includes(lowerQuery) ||
        output.content.toLowerCase().includes(lowerQuery) ||
        output.fromSubAgent.toLowerCase().includes(lowerQuery) ||
        output.sentTo.toLowerCase().includes(lowerQuery) ||
        output.outputType.toLowerCase().includes(lowerQuery)
      );
    }

    return outputs;
  }

  /**
   * Get all unique sub-agent names
   */
  static async getAllSubAgentNames(): Promise<string[]> {
    const outputs = await this.getSubAgentOutputs();
    const subAgents = new Set<string>();
    outputs.forEach(output => {
      subAgents.add(output.fromSubAgent);
      if (!output.sentTo.includes('user-proxy')) {
        subAgents.add(output.sentTo);
      }
    });
    return Array.from(subAgents).sort();
  }

  /**
   * Get all unique output types
   */
  static async getAllOutputTypes(): Promise<string[]> {
    const outputs = await this.getSubAgentOutputs();
    return [...new Set(outputs.map(output => output.outputType))].sort();
  }

  /**
   * Get communication statistics
   */
  static async getCommunicationStatistics(): Promise<{
    totalCommunications: number;
    uniqueSubAgents: number;
    uniqueOutputTypes: number;
    userProxyDecisions: number;
    avgOptionsPerDecision: number;
    communicationsByAgent: { [agentId: string]: number };
  }> {
    const outputs = await this.getSubAgentOutputs();
    const subAgentNames = await this.getAllSubAgentNames();
    const outputTypes = await this.getAllOutputTypes();
    
    const userProxyOutputs = outputs.filter(output => 
      output.sentTo.includes('user-proxy') && output.options
    );
    
    const totalOptions = userProxyOutputs.reduce((sum, output) => 
      sum + (output.options?.length || 0), 0
    );
    
    const avgOptionsPerDecision = userProxyOutputs.length > 0 
      ? totalOptions / userProxyOutputs.length 
      : 0;
    
    // Count communications by agent
    const communicationsByAgent: { [agentId: string]: number } = {};
    outputs.forEach(output => {
      communicationsByAgent[output.fromAgentId] = (communicationsByAgent[output.fromAgentId] || 0) + 1;
    });

    return {
      totalCommunications: outputs.length,
      uniqueSubAgents: subAgentNames.length,
      uniqueOutputTypes: outputTypes.length,
      userProxyDecisions: userProxyOutputs.length,
      avgOptionsPerDecision: Math.round(avgOptionsPerDecision * 10) / 10,
      communicationsByAgent
    };
  }
}