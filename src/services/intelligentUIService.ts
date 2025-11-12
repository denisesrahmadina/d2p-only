import { useRef, useEffect, RefObject } from 'react';

// Gemini API configuration
const GEMINI_API_KEY = 'AIzaSyD1S4r1Xz-7E2f8RyQFEehmzuHa7ZrINMM';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

// Types for intelligent UI
export interface UICommand {
  action: 'click' | 'scroll' | 'navigate';
  target: string;
  value?: string | number | boolean;
  modalType?: string;
  agentId?: string;
}

export interface TargetRef {
  ref: RefObject<HTMLElement>;
  action?: (value?: any) => void;
  modalType?: string;
}

// Helper to extract button labels from the current page
export const extractVisibleButtonLabels = (): string[] => {
  // Get all visible buttons on the page
  const buttons = document.querySelectorAll('button:not([style*="display: none"])');
  
  // Extract text content from buttons
  const buttonLabels = Array.from(buttons)
    .map(btn => btn.textContent?.trim())
    .filter((label): label is string => Boolean(label) && label.length > 0);
  
  console.log('🔘 [INTELLIGENT UI] Found button labels:', buttonLabels);
  return buttonLabels;
};

// Helper to extract button IDs from the current page
export const extractVisibleButtonIds = (): string[] => {
  // Get all visible buttons with IDs on the page
  const buttons = document.querySelectorAll('button[id]:not([style*="display: none"])');
  
  // Extract IDs from buttons
  const buttonIds = Array.from(buttons)
    .map(btn => btn.id)
    .filter(id => id && id.length > 0);
  
  console.log('🆔 [INTELLIGENT UI] Found button IDs:', buttonIds);
  return buttonIds;
};

// Helper to extract clickable elements (links, cards, etc.)
export const extractClickableElements = (): Array<{id: string, text: string, type: string}> => {
  const clickableElements: Array<{id: string, text: string, type: string}> = [];
  
  // Get agent cards
  const agentCards = document.querySelectorAll('a[href*="/agent/"]');
  agentCards.forEach(card => {
    const agentName = card.querySelector('h3')?.textContent?.trim();
    const href = card.getAttribute('href');
    if (agentName && href) {
      clickableElements.push({
        id: href,
        text: agentName,
        type: 'agent-card'
      });
    }
  });
  
  // Get navigation links
  const navLinks = document.querySelectorAll('nav a, aside a');
  navLinks.forEach(link => {
    const text = link.textContent?.trim();
    const href = link.getAttribute('href');
    if (text && href) {
      clickableElements.push({
        id: href,
        text: text,
        type: 'navigation-link'
      });
    }
  });
  
  // Get tabs
  const tabs = document.querySelectorAll('[role="tab"], button[class*="tab"]');
  tabs.forEach(tab => {
    const text = tab.textContent?.trim();
    const id = tab.id || tab.getAttribute('data-tab');
    if (text && id) {
      clickableElements.push({
        id: id,
        text: text,
        type: 'tab'
      });
    }
  });
  
  console.log('🎯 [INTELLIGENT UI] Found clickable elements:', clickableElements);
  return clickableElements;
};

// Helper to get current page context
export const getCurrentPageContext = (): {
  url: string;
  pageType: string;
  agentId?: string;
  activeTab?: string;
} => {
  const url = window.location.href;
  const pathname = window.location.pathname;
  
  let pageType = 'unknown';
  let agentId: string | undefined;
  let activeTab: string | undefined;
  
  if (pathname === '/dashboard') {
    pageType = 'dashboard';
  } else if (pathname === '/alerts') {
    pageType = 'alerts';
  } else if (pathname === '/settings') {
    pageType = 'settings';
  } else if (pathname.startsWith('/agent/')) {
    pageType = 'agent-detail';
    agentId = pathname.split('/agent/')[1];
    
    // Try to detect active tab
    const activeTabElement = document.querySelector('[class*="border-blue-500"]');
    activeTab = activeTabElement?.textContent?.trim().toLowerCase();
  }
  
  return { url, pageType, agentId, activeTab };
};

// Helper function to robustly extract JSON from Gemini API response
const extractJSONFromResponse = (text: string): string | null => {
  // First, check for JSON within markdown code blocks
  const markdownJsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (markdownJsonMatch) {
    return markdownJsonMatch[1].trim();
  }
  
  // Check for JSON within generic code blocks
  const codeBlockMatch = text.match(/```\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    const content = codeBlockMatch[1].trim();
    // Check if the content looks like JSON (starts with { and ends with })
    if (content.startsWith('{') && content.endsWith('}')) {
      return content;
    }
  }
  
  // Fall back to extracting content between first and last curly braces
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0].trim();
  }
  
  return null;
};

// Function to call Gemini API for intelligent UI actions
export const callGeminiAPI = async (
  userMessage: string
): Promise<UICommand | null> => {
  try {
    // Get current page context
    const pageContext = getCurrentPageContext();
    const visibleButtonLabels = extractVisibleButtonLabels();
    const visibleButtonIds = extractVisibleButtonIds();
    const clickableElements = extractClickableElements();

    console.group('🧠 [INTELLIGENT UI] Calling Gemini API');
    console.log('📝 User Message:', userMessage);
    console.log('🌐 Page Context:', pageContext);
    console.log('🔘 Visible Button Labels:', visibleButtonLabels);
    console.log('🆔 Visible Button IDs:', visibleButtonIds);
    console.log('🎯 Clickable Elements:', clickableElements);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
              text: `You are an AI assistant that helps users interact with an Enterprise AI Agents dashboard. You understand both English and Indonesian (Bahasa Indonesia).

You are given:
1. A user message from a conversation
2. Current page context (URL, page type, active agent, active tab)
3. A list of visible button labels
4. A list of visible button IDs
5. A list of clickable elements (agent cards, navigation links, tabs)

Your task:
- Determine if the user wants to interact with any UI element based on their message
- Handle both user messages and AI assistant messages that mention agents
- Support both English and Indonesian language requests
- Common intents include:
  * Opening agent details (e.g., "show me the performance watchtower", "what is AI strategy orchestrator", "coba lihatin AI Strategy Orchestrator", "buka AI Strategy Orchestrator", "jelasin AI strategy orchestrator dong")
  * Navigating to different pages (e.g., "go to alerts", "show dashboard", "open settings", "buka dashboard", "ke halaman alerts")
  * Switching tabs (e.g., "show agent flow", "view outputs", "run simulation", "tampilkan flow", "lihat output")
  * Clicking buttons (e.g., "run the agent", "refresh data", "jalankan agent", "refresh")
  * Scrolling to sections (e.g., "show metrics", "view capabilities", "lihat metrics", "tampilkan kemampuan")

Special handling for AI assistant messages:
- If the message mentions multiple agents in sequence (like listing agents), focus on the FIRST mentioned agent
- Look for agent names in Indonesian explanations (e.g., "AI Strategy Orchestrator, membantu menyelaraskan...")
- Prioritize agent navigation over other actions when agents are mentioned

Indonesian language keywords to recognize:
- "coba lihatin" / "coba lihat" / "lihatin" / "lihat" = "show me" / "view"
- "buka" / "bukain" = "open"
- "tampilkan" / "tampilin" = "show" / "display"
- "ke" / "pergi ke" = "go to"
- "jalankan" = "run"
- "refresh" / "update" = "refresh"
- "diklik" / "klik" = "click"
- "dong" = casual particle (ignore for intent)
- "gue" / "aku" = "I" (ignore for intent)
- "mau tahu" / "pengen tahu" = "want to know"

Return a JSON object with the following structure:

For navigating to agent details or information (PRIORITIZE THIS for agent mentions):
{
  "action": "navigate",
  "target": "/agent/<agent-id>",
  "agentId": "<agent-id>",
  "value": "<agent-name>"
}

For navigating to pages:
{
  "action": "navigate", 
  "target": "/dashboard" | "/alerts" | "/settings",
  "value": "<page-name>"
}

For clicking tabs:
{
  "action": "click",
  "target": "<tab-name>",
  "value": "<tab-label>"
}

For clicking buttons:
{
  "action": "click",
  "target": "<button-id>",
  "value": "<button-label>"
}

For scrolling to sections:
{
  "action": "scroll",
  "target": "<section-name>"
}

Agent ID mapping (use these exact IDs):
- "AI Strategy Orchestrator" -> "ai-strategy-orchestrator"
- "Performance Watchtower" -> "performance-watchtower"
- "Policy & Compliance Governance" -> "policy-compliance"
- "Subholding Coordinator" -> "subholding-coordinator"
- "Investment Evaluator" -> "investment-evaluator"
- "Risk & Governance Watcher" -> "risk-governance-watcher"
- "Net-Zero & ESG Tracker" -> "netzero-tracker"
- "Group Financial Orchestrator" -> "group-financial-orchestrator"
- "Credit Risk Intelligence" -> "credit-risk-intelligence"
- "Digital Banking Optimizer" -> "digital-banking-optimizer"
- "Petrochemical Optimizer" -> "petrochemical-optimizer"
- "Renewable Energy Coordinator" -> "renewable-energy-coordinator"
- "Supply Chain Intelligence" -> "supply-chain-intelligence"
- "Equipment Lifecycle Manager" -> "equipment-lifecycle-manager"
- "Logistics Optimization Engine" -> "logistics-optimization-engine"
- "Customer Experience Orchestrator" -> "customer-experience-orchestrator"
- "Financial Intelligence Advisor" -> "financial-intelligence-advisor"

Agent name variations to recognize:
- "AI Strategy Orchestrator" / "strategy orchestrator" / "orchestrator" / "AI strategy"
- "Performance Watchtower" / "performance" / "watchtower" / "monitoring"
- "Policy & Compliance Governance" / "compliance" / "policy" / "governance"
- "Subholding Coordinator" / "coordinator" / "subholding" / "cross-bu"
- "Investment Evaluator" / "investment" / "evaluator" / "portfolio"
- "Risk & Governance Watcher" / "risk" / "governance" / "watcher"
- "Net-Zero & ESG Tracker" / "esg" / "net-zero" / "tracker" / "sustainability"
- "Enterprise Policy and Compliance Governance" / "enterprise policy" / "compliance governance"

Tab mapping:
- "overview" | "metrics" | "performance" -> "overview"
- "flow" | "agent flow" | "workflow" -> "flow"
- "inputs" | "data inputs" | "input data" -> "inputs"
- "outputs" | "results" | "agent outputs" -> "outputs"
- "simulation" | "run agent" | "test agent" -> "simulation"

If no appropriate UI action can be determined, return null.

User message: ${userMessage}

Current page context:
${JSON.stringify(pageContext, null, 2)}

Visible button labels:
${JSON.stringify(visibleButtonLabels, null, 2)}

Visible button IDs:
${JSON.stringify(visibleButtonIds, null, 2)}

Clickable elements:
${JSON.stringify(clickableElements, null, 2)}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 300,
        }
      })
    });

    const data = await response.json();
    console.log('✅ Gemini API response:', data);

    if (data && Array.isArray(data.candidates) && data.candidates.length > 0 && data.candidates[0] && data.candidates[0].content) {
      const text = data.candidates[0].content.parts[0].text;

      if (text.trim().toLowerCase() === 'null') {
        console.log('ℹ️ Gemini determined this is not a UI action request');
        console.groupEnd();
        return null;
      }

      const jsonStr = extractJSONFromResponse(text);
      if (jsonStr) {
        try {
          const command = JSON.parse(jsonStr) as UICommand;
          console.log('🎯 Extracted command:', command);
          console.groupEnd();
          return command;
        } catch (parseError) {
          console.error('❌ Error parsing extracted JSON:', parseError);
          console.log('📄 Raw extracted JSON string:', jsonStr);
        }
      }
    }

    console.log('❌ Failed to extract command from response');
    console.groupEnd();
    return null;

  } catch (error) {
    console.error('❌ Error calling Gemini API:', error);
    console.groupEnd();
    return null;
  }
};

// Main Intelligent UI Service class
export class IntelligentUIService {
  private static instance: IntelligentUIService;
  private navigationCallback?: (path: string) => void;
  private tabChangeCallback?: (tabName: string) => void;
  private autoNavigationQueue: string[] = [];
  private isAutoNavigating = false;
  private autoNavigationDelay = 6000; // 3 seconds between navigations

  private constructor() {}

  static getInstance(): IntelligentUIService {
    if (!IntelligentUIService.instance) {
      IntelligentUIService.instance = new IntelligentUIService();
    }
    return IntelligentUIService.instance;
  }

  // Set navigation callback (from React Router)
  setNavigationCallback(callback: (path: string) => void) {
    this.navigationCallback = callback;
  }

  // Set tab change callback
  setTabChangeCallback(callback: (tabName: string) => void) {
    this.tabChangeCallback = callback;
  }

  // Set auto-navigation delay
  setAutoNavigationDelay(delay: number) {
    this.autoNavigationDelay = delay;
  }

  // Process auto-navigation queue
  private async processAutoNavigationQueue() {
    if (this.isAutoNavigating || this.autoNavigationQueue.length === 0) {
      return;
    }

    this.isAutoNavigating = true;
    console.log('🚀 [INTELLIGENT UI] Starting auto-navigation sequence:', this.autoNavigationQueue);

    for (const agentPath of this.autoNavigationQueue) {
      console.log(`🧭 [INTELLIGENT UI] Auto-navigating to: ${agentPath}`);
      
      if (this.navigationCallback) {
        this.navigationCallback(agentPath);
      }
      
      // Wait before next navigation
      if (this.autoNavigationQueue.indexOf(agentPath) < this.autoNavigationQueue.length - 1) {
        await new Promise(resolve => setTimeout(resolve, this.autoNavigationDelay));
      }
    }

    // Clear queue and reset flag
    this.autoNavigationQueue = [];
    this.isAutoNavigating = false;
    console.log('✅ [INTELLIGENT UI] Auto-navigation sequence completed');
  }

  // Extract agent mentions from AI message
  private extractAgentMentions(message: string): string[] {
    const agentMentions: string[] = [];
    
    // Agent name to ID mapping
    const agentMapping: { [key: string]: string } = {
      'ai strategy orchestrator': 'ai-strategy-orchestrator',
      'strategy orchestrator': 'ai-strategy-orchestrator',
      'performance watchtower': 'performance-watchtower',
      'watchtower': 'performance-watchtower',
      'enterprise policy and compliance governance': 'policy-compliance',
      'policy and compliance governance': 'policy-compliance',
      'compliance governance': 'policy-compliance',
      'policy compliance': 'policy-compliance',
      'subholding coordinator': 'subholding-coordinator',
      'subholding plan & task communicator': 'subholding-coordinator',
      'investment evaluator': 'investment-evaluator',
      'investment & portfolio evaluator': 'investment-evaluator',
      'risk governance watcher': 'risk-governance-watcher',
      'ai risk & governance watcher': 'risk-governance-watcher',
      'net-zero tracker': 'netzero-tracker',
      'net-zero & esg progress tracker': 'netzero-tracker',
      'esg tracker': 'netzero-tracker',
      'group financial orchestrator': 'group-financial-orchestrator',
      'credit risk intelligence': 'credit-risk-intelligence',
      'digital banking optimizer': 'digital-banking-optimizer',
      'petrochemical optimizer': 'petrochemical-optimizer',
      'renewable energy coordinator': 'renewable-energy-coordinator',
      'supply chain intelligence': 'supply-chain-intelligence',
      'equipment lifecycle manager': 'equipment-lifecycle-manager',
      'logistics optimization engine': 'logistics-optimization-engine',
      'customer experience orchestrator': 'customer-experience-orchestrator',
      'financial intelligence advisor': 'financial-intelligence-advisor'
    };

    const lowerMessage = message.toLowerCase();
    
    // Look for agent mentions in order of appearance
    for (const [agentName, agentId] of Object.entries(agentMapping)) {
      if (lowerMessage.includes(agentName)) {
        agentMentions.push(agentId);
      }
    }

    // Remove duplicates while preserving order
    return [...new Set(agentMentions)];
  }

  // Process user message and execute UI actions
  async processMessage(userMessage: string): Promise<boolean> {
    console.group('🔍 [INTELLIGENT UI] Processing message');
    console.log('📝 Message:', userMessage);

    try {
      // Check if this is an AI message listing multiple agents
      const agentMentions = this.extractAgentMentions(userMessage);
      
      if (agentMentions.length > 1) {
        console.log('🤖 [INTELLIGENT UI] AI message detected with multiple agents:', agentMentions);
        
        // Queue auto-navigation for multiple agents
        this.autoNavigationQueue = agentMentions.map(agentId => `/agent/${agentId}`);
        
        // Start auto-navigation sequence
        setTimeout(() => {
          this.processAutoNavigationQueue();
        }, 1000); // Start after 1 second
        
        console.groupEnd();
        return true;
      }

      const command = await callGeminiAPI(userMessage);

      if (command) {
        return this.executeCommand(command);
      } else {
        console.log('ℹ️ No UI action needed for this message');
        console.groupEnd();
        return false;
      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
      console.groupEnd();
      return false;
    }
  }

  // Execute UI command
  private executeCommand(command: UICommand): boolean {
    console.group('🎯 [INTELLIGENT UI] Executing command');
    console.log('📋 Command:', command);

    const { action, target, value, agentId } = command;

    switch (action) {
      case 'navigate':
        if (this.navigationCallback) {
          console.log(`🧭 Navigating to: ${target}`);
          this.navigationCallback(target);
          console.groupEnd();
          return true;
        } else {
          // Fallback to window.location
          console.log(`🧭 Navigating to: ${target} (fallback)`);
          window.location.href = target;
          console.groupEnd();
          return true;
        }

      case 'click':
        // Try to find and click the target element
        let element = document.getElementById(target);
        
        if (!element) {
          // Try to find by button text
          const buttons = document.querySelectorAll('button');
          element = Array.from(buttons).find(btn => 
            btn.textContent?.trim()?.toLowerCase() === target.toLowerCase() ||
            btn.textContent?.trim()?.toLowerCase() === value?.toString().toLowerCase()
          ) as HTMLElement;
        }

        if (!element) {
          // Try to find tab by text content
          const tabs = document.querySelectorAll('[role="tab"], button[class*="tab"]');
          element = Array.from(tabs).find(tab => 
            tab.textContent?.trim()?.toLowerCase()?.includes(target.toLowerCase())
          ) as HTMLElement;
        }

        if (element) {
          console.log(`🖱️ Clicking element: ${target}`);
          element.click();
          
          // If it's a tab change, notify callback
          if (this.tabChangeCallback && (target === 'overview' || target === 'flow' || target === 'inputs' || target === 'outputs' || target === 'simulation')) {
            this.tabChangeCallback(target);
          }
          
          console.groupEnd();
          return true;
        } else {
          console.log(`❌ Element not found: ${target}`);
        }
        break;

      case 'scroll':
        console.log(`📜 Scrolling to section: ${target}`);
        
        // Try to find the section to scroll to
        const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const matchingHeader = Array.from(headers).find(header => 
          header.textContent?.toLowerCase().includes(target.toLowerCase())
        );
        
        if (matchingHeader) {
          matchingHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
          console.log(`✅ Scrolled to: ${matchingHeader.textContent}`);
          console.groupEnd();
          return true;
        } else {
          // Try to find by class or ID
          const sections = document.querySelectorAll(`[class*="${target}"], [id*="${target}"]`);
          if (sections.length > 0) {
            sections[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.log(`✅ Scrolled to section with matching class/id`);
            console.groupEnd();
            return true;
          }
        }
        
        console.log(`❌ Could not find section: ${target}`);
        break;

      default:
        console.log(`❌ Unknown action: ${action}`);
        break;
    }

    console.log('❌ Failed to execute command');
    console.groupEnd();
    return false;
  }
}

// Hook to integrate intelligent UI with React components
export const useIntelligentUI = () => {
  const service = IntelligentUIService.getInstance();

  // Function to process messages
  const processMessage = async (message: string): Promise<boolean> => {
    return await service.processMessage(message);
  };

  return {
    processMessage,
    service
  };
};

// Hook for agent detail pages to register tab changes
export const useAgentDetailIntelligentUI = (
  activeTab: string,
  setActiveTab: (tab: string) => void,
  navigate: (path: string) => void
) => {
  const service = IntelligentUIService.getInstance();

  useEffect(() => {
    // Register navigation callback
    service.setNavigationCallback(navigate);
    
    // Register tab change callback
    service.setTabChangeCallback((tabName: string) => {
      const validTabs = ['overview', 'flow', 'inputs', 'outputs', 'simulation'];
      if (validTabs.includes(tabName)) {
        setActiveTab(tabName);
      }
    });
  }, [navigate, setActiveTab]);

  return service;
};

// Export the service instance
export const intelligentUIService = IntelligentUIService.getInstance();