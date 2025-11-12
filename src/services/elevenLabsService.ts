import { AgentDataService } from './agentDataService';
import { AgentStatisticsService } from './agentStatisticsService';

export interface ElevenLabsConfig {
  agentId: string;
  baseUrl?: string;
}

export interface VoiceSession {
  sessionId: string;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  isRecording: boolean;
  isSpeaking: boolean;
}

// Agent configuration for Enterprise Group AI Agents
export const AGENT_CONFIG: ElevenLabsConfig = {
  agentId: 'agent_0401k2b1gptrf4b83m276699katt', // Your ElevenLabs agent ID
  baseUrl: 'https://api.elevenlabs.io/v1',
};

// Tool handlers for the Enterprise AI platform
export const getAgentStatusHandler = async (input: any) => {
  console.log('🔧 [TOOL] getAgentStatus called with:', input);
  
  // Mock response for agent status
  return {
    success: true,
    data: {
      activeAgents: 7,
      totalTasks: 1247,
      avgUptime: 98.5,
      criticalAlerts: 2
    }
  };
};

export const getPerformanceMetricsHandler = async (input: any, organizationId?: string) => {
  console.log('🔧 [TOOL] getPerformanceMetrics called with:', input);
  console.log('🏢 [TOOL] Organization ID:', organizationId);
  
  try {
    // Get all agents from the service
    const allAgents = await AgentDataService.getAgents();
    
    // Filter agents by organization ID if provided
    const filteredAgents = organizationId 
      ? allAgents.filter(agent => agent.organizationId === organizationId)
      : allAgents;
    
    // Filter out agents with undefined or incomplete metrics
    const validAgents = filteredAgents.filter(agent => 
      agent && 
      agent.metrics && 
      typeof agent.metrics.uptime === 'number' &&
      typeof agent.metrics.responseTime === 'number' &&
      typeof agent.metrics.tasksCompleted === 'number' &&
      typeof agent.metrics.errorRate === 'number'
    );
    
    console.log('📊 [TOOL] Found agents:', {
      total: allAgents.length,
      filtered: filteredAgents.length,
      valid: validAgents.length,
      organizationId
    });
    
    if (validAgents.length === 0) {
      return {
        success: true,
        data: {
          message: 'No valid agents found for this organization',
          totalAgents: filteredAgents.length,
          validAgents: 0,
          organizationId
        }
      };
    }
    
    // Get statistics for all agents in the organization
    const agentStats = await Promise.all(
      validAgents.map(async (agent) => {
        try {
          const recentStats = await AgentStatisticsService.getRecentStatistics(agent.id, 7);
          const avgMetrics = await AgentStatisticsService.getAverageMetrics(agent.id, 7);
          
          return {
            agentId: agent.id,
            agentName: agent.name,
            currentMetrics: agent.metrics,
            weeklyAverage: avgMetrics,
            recentStats: recentStats.slice(0, 3) // Last 3 days
          };
        } catch (error) {
          console.error(`Error getting stats for agent ${agent.id}:`, error);
          return {
            agentId: agent.id,
            agentName: agent.name,
            currentMetrics: agent.metrics,
            weeklyAverage: null,
            recentStats: []
          };
        }
      })
    );
    
    // Calculate organization-wide performance metrics
    const totalTasks = validAgents.reduce((sum, agent) => sum + agent.metrics.tasksCompleted, 0);
    const avgUptime = validAgents.reduce((sum, agent) => sum + agent.metrics.uptime, 0) / validAgents.length;
    const avgResponseTime = validAgents.reduce((sum, agent) => sum + agent.metrics.responseTime, 0) / validAgents.length;
    const avgErrorRate = validAgents.reduce((sum, agent) => sum + agent.metrics.errorRate, 0) / validAgents.length;
    const activeAgents = validAgents.filter(agent => agent.status === 'active').length;
    
    return {
      success: true,
      data: {
        organizationSummary: {
          totalAgents: validAgents.length,
          activeAgents,
          totalTasksCompleted: totalTasks,
          averageUptime: Math.round(avgUptime * 10) / 10,
          averageResponseTime: Math.round(avgResponseTime * 100) / 100,
          averageErrorRate: Math.round(avgErrorRate * 100) / 100,
          organizationId
        },
        agentPerformance: agentStats,
        topPerformers: {
          highestUptime: validAgents.reduce((prev, current) => 
            prev.metrics.uptime > current.metrics.uptime ? prev : current
          ),
          fastestResponse: validAgents.reduce((prev, current) => 
            prev.metrics.responseTime < current.metrics.responseTime ? prev : current
          ),
          mostTasks: validAgents.reduce((prev, current) => 
            prev.metrics.tasksCompleted > current.metrics.tasksCompleted ? prev : current
          )
        }
      }
    };
    
  } catch (error) {
    console.error('❌ [TOOL] Error in getPerformanceMetrics:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

export const getAlertsHandler = async (input: any) => {
  console.log('🔧 [TOOL] getAlerts called with:', input);
  
  // Mock response for alerts
  return {
    success: true,
    data: [
      {
        id: '1',
        title: 'Critical Performance Anomaly',
        severity: 'critical',
        source: 'Performance Watchtower',
        timestamp: '5 min ago'
      },
      {
        id: '2',
        title: 'Compliance Gap Identified',
        severity: 'high',
        source: 'Policy & Compliance Agent',
        timestamp: '15 min ago'
      }
    ]
  };
};

export const getAgentDetailsHandler = async (input: any, organizationId?: string) => {
  console.log('🔧 [TOOL] getAgentDetails called with:', input);
  console.log('🏢 [TOOL] Organization ID:', organizationId);
  
  try {
    // Get all agents from the service
    const allAgents = await AgentDataService.getAgents();
    
    // Filter agents by organization ID if provided
    const filteredAgents = organizationId 
      ? allAgents.filter(agent => agent.organizationId === organizationId)
      : allAgents;
    
    console.log('📊 [TOOL] Found agents:', {
      total: allAgents.length,
      filtered: filteredAgents.length,
      organizationId
    });
    
    // If input contains a specific agent name or ID, try to find it
    let targetAgent = null;
    if (input && typeof input === 'object') {
      const searchTerm = input.name || input.agentName || input.id || input.agentId;
      if (searchTerm) {
        targetAgent = filteredAgents.find(agent => 
          agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.id === searchTerm
        );
      }
    }
    
    // If no specific agent found, return summary of all agents in organization
    if (!targetAgent) {
      const agentSummary = filteredAgents.map(agent => ({
        id: agent.id,
        name: agent.name,
        status: agent.status,
        uptime: agent.metrics.uptime,
        tasksCompleted: agent.metrics.tasksCompleted,
        responseTime: agent.metrics.responseTime,
        errorRate: agent.metrics.errorRate,
        goals: agent.goals,
        businessBenefit: agent.businessBenefit
      }));
      
      return {
        success: true,
        data: {
          type: 'organization_agents_summary',
          organizationAgents: agentSummary,
          totalAgents: filteredAgents.length,
          activeAgents: filteredAgents.filter(a => a.status === 'active').length,
          avgUptime: filteredAgents.length > 0 
            ? (filteredAgents.reduce((sum, a) => sum + a.metrics.uptime, 0) / filteredAgents.length).toFixed(1)
            : 0,
          totalTasksCompleted: filteredAgents.reduce((sum, a) => sum + a.metrics.tasksCompleted, 0)
        }
      };
    }
    
    // Return specific agent details
    return {
      success: true,
      data: {
        type: 'specific_agent_details',
        id: targetAgent.id,
        name: targetAgent.name,
        status: targetAgent.status,
        goals: targetAgent.goals,
        description: targetAgent.description,
        businessBenefit: targetAgent.businessBenefit,
        capabilities: targetAgent.capabilities,
        metrics: {
          uptime: targetAgent.metrics.uptime,
          responseTime: targetAgent.metrics.responseTime,
          tasksCompleted: targetAgent.metrics.tasksCompleted,
          errorRate: targetAgent.metrics.errorRate
        },
        llm: {
          primary: targetAgent.llm.primary,
          model: targetAgent.llm.model,
          temperature: targetAgent.llm.temperature
        },
        tools: targetAgent.tools,
        lastUpdated: targetAgent.lastUpdated
      }
    };
    
  } catch (error) {
    console.error('❌ [TOOL] Error in getAgentDetails:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

export const getAboutPlatformHandler = async (input: any, organizationId?: string) => {
  console.log('🔧 [TOOL] getAboutPlatform called with:', input);
  console.log('🏢 [TOOL] Organization ID:', organizationId);
  
  try {
    // Get all agents from the service
    const allAgents = await AgentDataService.getAgents();
    
    // Filter agents by organization ID if provided
    const filteredAgents = organizationId 
      ? allAgents.filter(agent => agent.organizationId === organizationId)
      : allAgents;
    
    console.log('📊 [TOOL] Found agents:', {
      total: allAgents.length,
      filtered: filteredAgents.length,
      organizationId
    });
    
    // Get unique organizations
    const uniqueOrganizations = [...new Set(allAgents.map(agent => agent.organizationId))];
    
    return {
      success: true,
      data: {
        platform: 'Enterprise Group AI Agents',
        description: 'Orchestrating intelligent operations across enterprise holdings',
        totalAgents: filteredAgents.length,
        totalOrganizations: uniqueOrganizations.length,
        currentOrganization: organizationId,
        activeAgents: filteredAgents.filter(agent => agent.status === 'active').length,
        features: [
          'Real-time performance monitoring',
          'Cross-BU coordination',
          'Compliance tracking',
          'Investment analysis',
          'ESG and Net-Zero tracking',
          'Risk and governance monitoring'
        ]
      }
    };
    
  } catch (error) {
    console.error('❌ [TOOL] Error in getAboutPlatform:', error);
    return {
      success: false,
      error: error.message,
      data: {
        platform: 'Enterprise Group AI Agents',
        description: 'Orchestrating intelligent operations across enterprise holdings',
        totalAgents: 0,
        totalOrganizations: 0,
        error: 'Failed to load agent data'
      }
    };
  }
};

export class ElevenLabsService {
  private config: ElevenLabsConfig;
  private session: VoiceSession | null = null;

  constructor(config: ElevenLabsConfig = AGENT_CONFIG) {
    this.config = config;
  }

  /**
   * Get current session status
   */
  getSessionStatus(): VoiceSession | null {
    return this.session;
  }

  /**
   * Check if session is connected
   */
  isConnected(): boolean {
    return this.session?.status === 'connected';
  }

  /**
   * Check if currently recording
   */
  isRecording(): boolean {
    return this.session?.isRecording || false;
  }

  /**
   * Check if agent is speaking
   */
  isSpeaking(): boolean {
    return this.session?.isSpeaking || false;
  }

  /**
   * Update session state
   */
  updateSession(updates: Partial<VoiceSession>): void {
    if (this.session) {
      this.session = { ...this.session, ...updates };
    }
  }

  /**
   * Clear session
   */
  clearSession(): void {
    this.session = null;
  }

  /**
   * Create new session
   */
  createSession(sessionId: string): VoiceSession {
    this.session = {
      sessionId,
      status: 'connected',
      isRecording: false,
      isSpeaking: false
    };
    return this.session;
  }
}