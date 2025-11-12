export interface FormattedFlowData {
  overview: {
    id: string;
    name: string;
    category: string;
    type: string;
    deployed: boolean;
    isPublic: boolean;
  };
  configuration: {
    nodes: Array<{
      id: string;
      label: string;
      type: string;
      position: { x: number; y: number };
      inputs?: any;
      outputs?: any;
    }>;
    edges: Array<{
      source: string;
      target: string;
    }>;
  };
  chatConfiguration?: {
    welcomeMessage?: string;
    starterPrompts?: string[];
    feedback?: boolean;
    speechToText?: boolean;
  };
}

export function formatFlowData(rawFlowData: any): FormattedFlowData {
  if (!rawFlowData) {
    throw new Error('No flow data provided');
  }

  const overview = {
    id: rawFlowData.id || 'N/A',
    name: rawFlowData.name || 'Unnamed Flow',
    category: rawFlowData.category || 'Uncategorized',
    type: rawFlowData.type || 'Unknown',
    deployed: rawFlowData.deployed || false,
    isPublic: rawFlowData.isPublic || false,
  };

  const nodes = (rawFlowData.flowData?.nodes || []).map((node: any) => ({
    id: node.id,
    label: node.data?.label || node.id,
    type: node.type || 'default',
    position: node.position || { x: 0, y: 0 },
    inputs: node.data?.inputs,
    outputs: node.data?.outputs,
  }));

  const edges = (rawFlowData.flowData?.edges || []).map((edge: any) => ({
    source: edge.source,
    target: edge.target,
  }));

  const chatConfig = rawFlowData.chatbotConfig ? {
    welcomeMessage: rawFlowData.chatbotConfig.welcomeMessage,
    starterPrompts: rawFlowData.chatbotConfig.starterPrompts,
    feedback: rawFlowData.chatbotConfig.feedback,
    speechToText: rawFlowData.chatbotConfig.speechToText,
  } : undefined;

  return {
    overview,
    configuration: {
      nodes,
      edges,
    },
    chatConfiguration: chatConfig,
  };
}

export function getReadableSummary(formattedData: FormattedFlowData): string {
  const { overview, configuration, chatConfiguration } = formattedData;

  let summary = `Flow: ${overview.name}\n`;
  summary += `Category: ${overview.category}\n`;
  summary += `Type: ${overview.type}\n`;
  summary += `Status: ${overview.deployed ? 'Deployed' : 'Not Deployed'}\n`;
  summary += `Visibility: ${overview.isPublic ? 'Public' : 'Private'}\n\n`;

  summary += `Components:\n`;
  summary += `- ${configuration.nodes.length} nodes\n`;
  summary += `- ${configuration.edges.length} connections\n\n`;

  if (chatConfiguration) {
    summary += `Chat Configuration:\n`;
    if (chatConfiguration.welcomeMessage) {
      summary += `- Welcome Message: ${chatConfiguration.welcomeMessage}\n`;
    }
    if (chatConfiguration.starterPrompts && chatConfiguration.starterPrompts.length > 0) {
      summary += `- Starter Prompts: ${chatConfiguration.starterPrompts.length} available\n`;
    }
    summary += `- Feedback: ${chatConfiguration.feedback ? 'Enabled' : 'Disabled'}\n`;
    summary += `- Speech-to-Text: ${chatConfiguration.speechToText ? 'Enabled' : 'Disabled'}\n`;
  }

  return summary;
}
