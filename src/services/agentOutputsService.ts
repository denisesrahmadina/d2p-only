import { AgentOutput } from '../types/agent';
import agentOutputsData from '../data/agentOutputs.json';

export class AgentOutputsService {
  /**
   * Get all agent outputs
   */
  static async getAgentOutputs(): Promise<AgentOutput[]> {
    // In the future, this could be replaced with an API call
    return agentOutputsData as AgentOutput[];
  }

  /**
   * Get outputs by agent ID
   */
  static async getOutputsByAgentId(agentId: string): Promise<AgentOutput[]> {
    const outputs = await this.getAgentOutputs();
    return outputs.filter(output => output.agentId === agentId);
  }

  /**
   * Get outputs by severity
   */
  static async getOutputsBySeverity(severity: string): Promise<AgentOutput[]> {
    const outputs = await this.getAgentOutputs();
    return outputs.filter(output => output.severity === severity);
  }

  /**
   * Get outputs by type
   */
  static async getOutputsByType(type: string): Promise<AgentOutput[]> {
    const outputs = await this.getAgentOutputs();
    return outputs.filter(output => output.type === type);
  }

  /**
   * Get outputs requiring action
   */
  static async getOutputsRequiringAction(): Promise<AgentOutput[]> {
    const outputs = await this.getAgentOutputs();
    return outputs.filter(output => output.actionRequired);
  }

  /**
   * Get recent outputs (last N items)
   */
  static async getRecentOutputs(limit: number = 10): Promise<AgentOutput[]> {
    const outputs = await this.getAgentOutputs();
    // Sort by timestamp (assuming ISO format or similar)
    return outputs.slice(0, limit);
  }

  /**
   * Get outputs summary by severity
   */
  static async getOutputsSummary() {
    const outputs = await this.getAgentOutputs();
    const summary = {
      critical: outputs.filter(o => o.severity === 'critical').length,
      high: outputs.filter(o => o.severity === 'high').length,
      medium: outputs.filter(o => o.severity === 'medium').length,
      low: outputs.filter(o => o.severity === 'low').length,
      total: outputs.length,
      actionRequired: outputs.filter(o => o.actionRequired).length
    };

    return summary;
  }
}