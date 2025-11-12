import mcpToolsData from '../data/mcpTools.json';

export interface MCPTool {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
}

export class MCPToolsService {
  /**
   * Get all MCP tools
   */
  static async getMCPTools(): Promise<MCPTool[]> {
    // In the future, this could be replaced with an API call
    return mcpToolsData as MCPTool[];
  }

  /**
   * Get MCP tool by ID
   */
  static async getMCPToolById(id: string): Promise<MCPTool | undefined> {
    const tools = await this.getMCPTools();
    return tools.find(tool => tool.id === id);
  }

  /**
   * Get MCP tools by status
   */
  static async getMCPToolsByStatus(status: string): Promise<MCPTool[]> {
    const tools = await this.getMCPTools();
    return tools.filter(tool => tool.status === status);
  }

  /**
   * Get MCP tools by type
   */
  static async getMCPToolsByType(type: string): Promise<MCPTool[]> {
    const tools = await this.getMCPTools();
    return tools.filter(tool => 
      tool.type.toLowerCase().includes(type.toLowerCase())
    );
  }

  /**
   * Get connected MCP tools
   */
  static async getConnectedMCPTools(): Promise<MCPTool[]> {
    return this.getMCPToolsByStatus('connected');
  }

  /**
   * Get MCP tools summary
   */
  static async getMCPToolsSummary() {
    const tools = await this.getMCPTools();
    return {
      total: tools.length,
      connected: tools.filter(t => t.status === 'connected').length,
      disconnected: tools.filter(t => t.status === 'disconnected').length,
      error: tools.filter(t => t.status === 'error').length,
      types: [...new Set(tools.map(t => t.type))].length
    };
  }

  /**
   * Get all tool types
   */
  static async getToolTypes(): Promise<string[]> {
    const tools = await this.getMCPTools();
    return [...new Set(tools.map(tool => tool.type))];
  }

  /**
   * Search MCP tools
   */
  static async searchMCPTools(query: string): Promise<MCPTool[]> {
    const tools = await this.getMCPTools();
    const lowerQuery = query.toLowerCase();
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.type.toLowerCase().includes(lowerQuery)
    );
  }
}