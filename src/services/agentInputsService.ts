import agentInputsData from '../data/agentInputs.json';

export interface InputRecord {
  id: string;
  timestamp: string;
  eventType: string;
  toolName: string;
  dataType: string;
  status: 'active' | 'stale' | 'error';
  lastUpdate: string;
  dataSourceSystem: string;
  data: string;
  sourceModule: string;
}

export interface AgentInputData {
  agentId: string;
  inputRecords: InputRecord[];
}

export class AgentInputsService {
  /**
   * Get all agent input data
   */
  static async getAgentInputs(): Promise<AgentInputData[]> {
    // In the future, this could be replaced with an API call
    return agentInputsData as AgentInputData[];
  }

  /**
   * Get input data by agent ID
   */
  static async getInputsByAgentId(agentId: string): Promise<AgentInputData | undefined> {
    const inputs = await this.getAgentInputs();
    return inputs.find(input => input.agentId === agentId);
  }

  /**
   * Get input records by agent ID
   */
  static async getInputRecordsByAgentId(agentId: string): Promise<InputRecord[]> {
    const agentInput = await this.getInputsByAgentId(agentId);
    return agentInput?.inputRecords || [];
  }

  /**
   * Get records by event type
   */
  static async getRecordsByEventType(agentId: string, eventType: string): Promise<InputRecord[]> {
    const records = await this.getInputRecordsByAgentId(agentId);
    return records.filter(record => record.eventType === eventType);
  }

  /**
   * Get records by data source system
   */
  static async getRecordsByDataSource(agentId: string, dataSourceSystem: string): Promise<InputRecord[]> {
    const records = await this.getInputRecordsByAgentId(agentId);
    return records.filter(record => 
      record.dataSourceSystem.toLowerCase().includes(dataSourceSystem.toLowerCase())
    );
  }

  /**
   * Get records by status
   */
  static async getRecordsByStatus(agentId: string, status: string): Promise<InputRecord[]> {
    const records = await this.getInputRecordsByAgentId(agentId);
    return records.filter(record => record.status === status);
  }

  /**
   * Get recent records (last N items)
   */
  static async getRecentRecords(agentId: string, limit: number = 10): Promise<InputRecord[]> {
    const records = await this.getInputRecordsByAgentId(agentId);
    // Sort by timestamp (most recent first)
    records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return records.slice(0, limit);
  }

  /**
   * Get input records summary by agent ID
   */
  static async getInputRecordsSummary(agentId: string) {
    const records = await this.getInputRecordsByAgentId(agentId);
    
    return {
      total: records.length,
      active: records.filter(r => r.status === 'active').length,
      stale: records.filter(r => r.status === 'stale').length,
      error: records.filter(r => r.status === 'error').length,
      dataSources: new Set(records.map(r => r.dataSourceSystem)).size,
      eventTypes: new Set(records.map(r => r.eventType)).size
    };
  }

  /**
   * Search records by content
   */
  static async searchRecords(agentId: string, query: string): Promise<InputRecord[]> {
    const records = await this.getInputRecordsByAgentId(agentId);
    const lowerQuery = query.toLowerCase();
    return records.filter(record => 
      record.data.toLowerCase().includes(lowerQuery) ||
      record.eventType.toLowerCase().includes(lowerQuery) ||
      record.sourceModule.toLowerCase().includes(lowerQuery) ||
      record.toolName.toLowerCase().includes(lowerQuery) ||
      record.dataSourceSystem.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter records by multiple criteria
   */
  static async filterRecords(agentId: string, filters: {
    eventType?: string;
    dataSourceSystem?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    searchTerm?: string;
  }): Promise<InputRecord[]> {
    let records = await this.getInputRecordsByAgentId(agentId);

    if (filters.eventType) {
      records = records.filter(record => record.eventType === filters.eventType);
    }

    if (filters.dataSourceSystem) {
      records = records.filter(record => 
        record.dataSourceSystem.toLowerCase().includes(filters.dataSourceSystem!.toLowerCase())
      );
    }

    if (filters.status) {
      records = records.filter(record => record.status === filters.status);
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      records = records.filter(record => new Date(record.timestamp) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      records = records.filter(record => new Date(record.timestamp) <= toDate);
    }

    if (filters.searchTerm) {
      const lowerQuery = filters.searchTerm.toLowerCase();
      records = records.filter(record => 
        record.data.toLowerCase().includes(lowerQuery) ||
        record.eventType.toLowerCase().includes(lowerQuery) ||
        record.sourceModule.toLowerCase().includes(lowerQuery) ||
        record.toolName.toLowerCase().includes(lowerQuery) ||
        record.dataSourceSystem.toLowerCase().includes(lowerQuery)
      );
    }

    return records;
  }
}