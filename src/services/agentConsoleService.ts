const AGENT_CONSOLE_BASE_URL = 'https://agentconsole.accentureid.ai/api/v1';
const AGENT_CONSOLE_AUTH_TOKEN = 'Bearer nGjIaxDdiRc7cmZ-fM3SF3HA371i_MLQPn89auHZtaA';

export interface AgentConsoleDefinition {
  id: string;
  name: string;
  flowData: any;
  deployed: boolean;
  category: string;
  [key: string]: any;
}

export interface ChatPredictionRequest {
  question: string;
  chatId?: string;
  streaming?: boolean;
}

export interface ChatPredictionResponse {
  text?: string;
  answer?: string;
  response?: string;
  chatId?: string;
  [key: string]: any;
}

export interface ParsedFlowNode {
  id: string;
  type: string;
  label: string;
  name: string;
  category: string;
  description: string;
  position: { x: number; y: number };
  llm?: {
    model?: string;
    modelName?: string;
    temperature?: string | number;
    maxTokens?: string | number;
    streaming?: boolean;
    provider?: string;
  };
  instruction?: string;
  systemMessage?: string;
  messages?: Array<{ role: string; content: string }>;
  tools?: string[];
  knowledges?: string[];
  enabledMemory?: boolean;
  memoryType?: string;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
}

export interface ParsedFlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

export interface ParsedAgentFlow {
  nodes: ParsedFlowNode[];
  edges: ParsedFlowEdge[];
  totalNodes: number;
  totalEdges: number;
  agentNodes: ParsedFlowNode[];
  toolNodes: ParsedFlowNode[];
  knowledgeNodes: ParsedFlowNode[];
}

class AgentConsoleService {
  private baseUrl: string;
  private authToken: string;

  constructor(baseUrl: string = AGENT_CONSOLE_BASE_URL, authToken: string = AGENT_CONSOLE_AUTH_TOKEN) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      'Authorization': this.authToken,
      'Accept': '*/*',
      'Content-Type': 'application/json',
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }

  async getAgentDefinition(flowId: string): Promise<AgentConsoleDefinition | null> {
    try {
      const url = `${this.baseUrl}/chatflows/${flowId}`;
      console.log('Fetching agent definition from:', url);

      const response = await this.fetchWithAuth(url, {
        method: 'GET',
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Received agent definition data');
        return data;
      } else {
        console.error('Failed to fetch agent definition:', response.status, response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching agent definition:', error);
      return null;
    }
  }

  parseAgentFlow(agentDefinition: AgentConsoleDefinition): ParsedAgentFlow | null {
    try {
      let flowData;

      if (typeof agentDefinition.flowData === 'string') {
        flowData = JSON.parse(agentDefinition.flowData);
      } else {
        flowData = agentDefinition.flowData;
      }

      if (!flowData || !flowData.nodes) {
        console.error('Invalid flow data structure');
        return null;
      }

      const parsedNodes: ParsedFlowNode[] = flowData.nodes.map((node: any) => {
        const parsedNode: ParsedFlowNode = {
          id: node.id || '',
          type: node.type || '',
          label: node.data?.label || '',
          name: node.data?.name || '',
          category: node.data?.category || '',
          description: node.data?.description || '',
          position: node.position || { x: 0, y: 0 },
        };

        // Parse LLM configuration
        if (node.data?.inputs?.agentModel || node.data?.inputs?.agentModelConfig) {
          const modelConfig = node.data.inputs.agentModelConfig || {};
          parsedNode.llm = {
            provider: node.data.inputs.agentModel || '',
            modelName: modelConfig.modelName || modelConfig.model || '',
            temperature: modelConfig.temperature || '',
            maxTokens: modelConfig.maxOutputTokens || modelConfig.maxTokens || '',
            streaming: modelConfig.streaming || false,
          };
        }

        // Parse instruction/system messages
        const messages = node.data?.inputs?.agentMessages;
        if (Array.isArray(messages) && messages.length > 0) {
          parsedNode.messages = messages;
          const systemMsg = messages.find((m: any) => m.role === 'assistant' || m.role === 'system');
          if (systemMsg) {
            parsedNode.systemMessage = systemMsg.content;
          }
        }

        // Parse tools
        const toolsInput = node.data?.inputs?.agentTools;
        if (toolsInput) {
          if (Array.isArray(toolsInput)) {
            parsedNode.tools = toolsInput;
          } else if (typeof toolsInput === 'string') {
            parsedNode.tools = [toolsInput];
          }
        }

        // Parse knowledges
        const knowledgeInput = node.data?.inputs?.agentKnowledgeDocumentStores;
        if (knowledgeInput) {
          if (Array.isArray(knowledgeInput)) {
            parsedNode.knowledges = knowledgeInput;
          } else if (typeof knowledgeInput === 'string') {
            parsedNode.knowledges = [knowledgeInput];
          }
        }

        // Parse memory settings
        parsedNode.enabledMemory = node.data?.inputs?.agentEnableMemory || false;
        parsedNode.memoryType = node.data?.inputs?.agentMemoryType || '';

        // Store all inputs and outputs
        parsedNode.inputs = node.data?.inputs || {};
        parsedNode.outputs = node.data?.outputs || {};

        return parsedNode;
      });

      const parsedEdges: ParsedFlowEdge[] = (flowData.edges || []).map((edge: any) => ({
        id: edge.id || '',
        source: edge.source || '',
        target: edge.target || '',
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        label: edge.label,
      }));

      // Categorize nodes
      const agentNodes = parsedNodes.filter(n =>
        n.type.toLowerCase().includes('agent') ||
        n.category.toLowerCase().includes('agent')
      );

      const toolNodes = parsedNodes.filter(n =>
        n.type.toLowerCase().includes('tool') ||
        n.category.toLowerCase().includes('tool')
      );

      const knowledgeNodes = parsedNodes.filter(n =>
        n.type.toLowerCase().includes('knowledge') ||
        n.type.toLowerCase().includes('document') ||
        n.category.toLowerCase().includes('knowledge')
      );

      return {
        nodes: parsedNodes,
        edges: parsedEdges,
        totalNodes: parsedNodes.length,
        totalEdges: parsedEdges.length,
        agentNodes,
        toolNodes,
        knowledgeNodes,
      };
    } catch (error) {
      console.error('Error parsing agent flow:', error);
      return null;
    }
  }

  async sendChatMessage(
    chatflowId: string,
    request: ChatPredictionRequest
  ): Promise<ChatPredictionResponse | null> {
    try {
      const url = `${this.baseUrl}/prediction/${chatflowId}`;
      console.log('Sending chat message to:', url);

      const response = await this.fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify(request),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Received chat response');
        return data;
      } else {
        console.error('Failed to send chat message:', response.status, response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error sending chat message:', error);
      return null;
    }
  }

  extractFlowIdFromUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    const match = url.match(/canvas\/([a-f0-9-]+)/);
    return match ? match[1] : null;
  }

  buildAgentFlowUrl(agentflowUrl: string, agentflowId: string): string {
    return `${agentflowUrl}${agentflowId}`;
  }
}

export const agentConsoleService = new AgentConsoleService();
