// Mock Chat Service - Uses in-memory data for demonstration purposes

export interface MockMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    duration?: number;
    confidence?: number;
    isVoice?: boolean;
  };
}

export interface AIService {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  mockConversation: MockMessage[];
}

// Mock AI Services - Two AI agents (Chat and Voice)
export const AI_SERVICES: AIService[] = [
  {
    id: 'chat-with-agent',
    name: 'Chat with our Agent',
    description: 'Text-based conversation with our AI procurement assistant',
    icon: '💬',
    color: 'from-purple-500 to-purple-700',
    mockConversation: [
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your AI Procurement Agent. I can help you with:\n\n• Procurement process questions\n• Best practices and recommendations\n• Policy interpretation\n• Strategic planning guidance\n• Supplier evaluation and management\n\nWhat would you like to know?',
        timestamp: new Date(Date.now() - 300000)
      },
      {
        id: '2',
        role: 'user',
        content: 'What are the key factors to consider when evaluating suppliers?',
        timestamp: new Date(Date.now() - 240000)
      },
      {
        id: '3',
        role: 'assistant',
        content: 'Great question! When evaluating suppliers, consider these key factors:\n\n**Performance Metrics:**\n• OTIF (On-Time In-Full) delivery rates - aim for 95%+\n• Quality metrics and defect rates\n• Response time to inquiries\n• Financial stability and credit ratings\n\n**Strategic Fit:**\n• Technical capabilities and production capacity\n• Geographic location and logistics efficiency\n• Sustainability and ESG practices\n• Innovation potential and R&D capabilities\n\n**Cost & Value:**\n• Total cost of ownership, not just unit price\n• Volume discounts and flexible payment terms\n• Long-term partnership value\n• Risk mitigation strategies\n\n**Compliance & Risk:**\n• Regulatory compliance history\n• Quality certifications (ISO, etc.)\n• Business continuity plans\n• Ethical sourcing practices\n\nWould you like me to elaborate on any of these areas or help you create a supplier scorecard?',
        timestamp: new Date(Date.now() - 180000)
      }
    ]
  },
  {
    id: 'talk-to-agent',
    name: 'Talk to our Agent',
    description: 'Voice-enabled conversation with hands-free interaction',
    icon: '🎤',
    color: 'from-green-500 to-green-700',
    mockConversation: [
      {
        id: '1',
        role: 'assistant',
        content: 'Voice Assistant activated! I can understand and respond to your spoken queries about:\n\n• Procurement status updates\n• Supplier performance metrics\n• Critical alerts and notifications\n• Purchase order status\n• Quick data summaries\n• Contract information\n\nSpeak naturally, and I\'ll help you!',
        timestamp: new Date(Date.now() - 300000),
        metadata: { isVoice: true, duration: 8.5 }
      },
      {
        id: '2',
        role: 'user',
        content: 'Show me my top suppliers by performance',
        timestamp: new Date(Date.now() - 240000),
        metadata: { isVoice: true, duration: 2.3, confidence: 0.96 }
      },
      {
        id: '3',
        role: 'assistant',
        content: 'Here are your top 5 suppliers by OTIF performance:\n\n1. **Supplier A** - 98.5% OTIF, $1.2M annual spend\n2. **Supplier B** - 97.8% OTIF, $890K annual spend\n3. **Supplier C** - 96.2% OTIF, $2.1M annual spend\n4. **Supplier D** - 95.9% OTIF, $650K annual spend\n5. **Supplier E** - 94.7% OTIF, $1.5M annual spend\n\nAll suppliers are performing above the 94% target threshold. Would you like more details on any specific supplier?',
        timestamp: new Date(Date.now() - 180000),
        metadata: { isVoice: true, duration: 15.2 }
      },
      {
        id: '4',
        role: 'user',
        content: 'Yes, tell me more about Supplier A',
        timestamp: new Date(Date.now() - 120000),
        metadata: { isVoice: true, duration: 1.8, confidence: 0.98 }
      },
      {
        id: '5',
        role: 'assistant',
        content: 'Supplier A Performance Details:\n\n**Delivery Performance:**\n• OTIF Rate: 98.5% (Top performer)\n• Average lead time: 12 days\n• Zero late deliveries last quarter\n\n**Financial Overview:**\n• Annual spend: $1.2 million\n• Contract expires: December 2025\n• Payment terms: Net 30\n\n**Quality Metrics:**\n• Defect rate: 0.3% (Excellent)\n• Customer satisfaction: 4.8/5\n• ISO 9001 certified\n\n**Recent Activity:**\n• 15 active purchase orders\n• Last delivery: 3 days ago\n• No outstanding issues\n\nSupplier A is recommended for contract renewal. Would you like to schedule a review meeting?',
        timestamp: new Date(Date.now() - 60000),
        metadata: { isVoice: true, duration: 18.4 }
      }
    ]
  }
];

// Generate contextual AI responses based on user input
export function generateMockAIResponse(userMessage: string, serviceId: string): MockMessage {
  const responses: Record<string, string[]> = {
    'chat-with-agent': [
      'Based on procurement best practices, I recommend focusing on data-driven decision making and strong supplier relationships. The key is to balance cost optimization with quality assurance and risk management.',
      'That\'s an excellent question. In procurement, we typically look at total cost of ownership rather than just unit price. This includes delivery costs, quality metrics, inventory carrying costs, and long-term reliability.',
      'Great point! Current industry trends show that sustainable procurement practices can lead to 15-20% cost savings while improving brand reputation, regulatory compliance, and long-term supplier partnerships.',
      'To optimize your procurement cycle, consider implementing automated approval workflows, real-time spend analytics, and supplier performance dashboards. This can reduce processing time by up to 40% while improving compliance.',
      'I can help you with that. Let me break down the procurement process into key stages: requisition, approval, sourcing, contracting, ordering, receiving, and payment. Each stage has specific best practices and automation opportunities.'
    ],
    'talk-to-agent': [
      'I\'ve found that information for you. Your current procurement status shows 23 active purchase orders with a total value of $4.2 million. Three orders require attention this week for approval.',
      'Quick summary: OTIF performance is at 95.8%, which is above target. Inventory levels are healthy at 85% of optimal stock. No critical alerts at this time. All major suppliers are performing well.',
      'Based on your query, here are the key metrics: Average processing time is 3.2 days, down 18% from last quarter. Cost savings year-to-date: $2.3 million, exceeding target by 12%. Compliance rate: 99.2%.',
      'I see you\'re asking about supplier performance. The top performers this month are maintaining excellent delivery rates above 96%, and we have no significant quality issues to report. Two suppliers need performance reviews.',
      'Let me check that for you. Your current contract portfolio includes 47 active agreements worth $8.5 million annually. Five contracts are up for renewal in the next 60 days. I can send you a detailed report if needed.'
    ]
  };

  const serviceResponses = responses[serviceId] || responses['chat-with-agent'];
  const randomResponse = serviceResponses[Math.floor(Math.random() * serviceResponses.length)];

  return {
    id: `msg-${Date.now()}-${Math.random()}`,
    role: 'assistant',
    content: randomResponse,
    timestamp: new Date(),
    metadata: serviceId === 'talk-to-agent' ? {
      isVoice: true,
      duration: 8 + Math.random() * 10
    } : undefined
  };
}

// Suggested prompts for each service
export const SUGGESTED_PROMPTS: Record<string, string[]> = {
  'chat-with-agent': [
    'How can I optimize my procurement cycle time?',
    'What are best practices for vendor evaluation?',
    'How do I improve supplier relationships?',
    'What KPIs should I track for procurement?',
    'Help me create a procurement strategy',
    'Explain contract negotiation strategies'
  ],
  'talk-to-agent': [
    'Show supplier performance',
    'Any critical alerts today?',
    'Give me a quick overview',
    'What needs my attention?',
    'Display recent purchase orders',
    'Check inventory status'
  ]
};
