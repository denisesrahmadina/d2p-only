import { useState, useCallback, useRef, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import { useAuth } from '../contexts/AuthContext';
import { AgentStatisticsService } from '../services/agentStatisticsService';
import { useOrganization } from '../contexts/OrganizationContext';
import { AgentDataService, AgentInputsService } from '../services';
import { 
  AGENT_CONFIG,
  getAgentStatusHandler,
  getPerformanceMetricsHandler,
  getAlertsHandler,
  getAgentDetailsHandler,
  getAboutPlatformHandler,
  ElevenLabsService
} from '../services/elevenLabsService';

interface VoiceContextOptions {
  agentType?: 'user proxy' | 'assistant agent';
  uiContext?: string;
  subAgentOutputs?: any[];
  invoiceData?: any;
}

interface ElevenLabsState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  sessionId: string | null;
  isRecording: boolean;
  isSpeaking: boolean;
}

interface ElevenLabsActions {
  initializeVoiceChat: (contextOptions?: VoiceContextOptions) => Promise<void>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>;
  endVoiceChat: () => Promise<void>;
  resetError: () => void;
}

export function useElevenLabs(): ElevenLabsState & ElevenLabsActions {
  const { selectedOrganization } = useAuth();
  const { getCurrentOrganization } = useOrganization();
  
  const [state, setState] = useState<ElevenLabsState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    sessionId: null,
    isRecording: false,
    isSpeaking: false
  });

  const serviceRef = useRef<ElevenLabsService>(new ElevenLabsService());
  
  // Get current organization details
  const currentOrg = getCurrentOrganization();

  // Initialize ElevenLabs conversation with real connection
  const conversation = useConversation({
    agentId: AGENT_CONFIG.agentId,
    onConnect: () => {
      console.group('🎙️ [ELEVENLABS] CONNECTION EVENT');
      console.log('🎙️ [ELEVENLABS] Connected to ElevenLabs agent');
      console.log('🔗 [ELEVENLABS] Agent ID:', AGENT_CONFIG.agentId);
      console.log('⏱️ Connection Time:', new Date().toISOString());
      console.groupEnd();
      
      setState(prev => ({ ...prev, isConnected: true, isConnecting: false }));
    },
    onDisconnect: () => {
      console.group('🔌 [ELEVENLABS] DISCONNECTION EVENT');
      console.log('🔌 [ELEVENLABS] Disconnected from ElevenLabs agent');
      console.log('⏱️ Disconnection Time:', new Date().toISOString());
      console.groupEnd();
      
      setState(prev => ({ 
        ...prev, 
        isConnected: false, 
        isConnecting: false,
        isRecording: false,
        isSpeaking: false,
        sessionId: null
      }));
      serviceRef.current.clearSession();
    },
    onError: (error) => {
      console.group('❌ [ELEVENLABS] ERROR EVENT');
      console.error('❌ [ELEVENLABS] ElevenLabs error:', error);
      console.error('🔍 [ELEVENLABS] Error details:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      console.groupEnd();
      
      setState(prev => ({ 
        ...prev, 
        error: error.message, 
        isConnecting: false,
        isRecording: false,
        isSpeaking: false
      }));
    },
    onMessage: (message) => {
      console.group('📨 [ELEVENLABS] MESSAGE EVENT');
      console.log('📨 [ELEVENLABS] Message from agent:', message);
      console.log('📋 [ELEVENLABS] Message details:', {
        source: message.source,
        content: message.message,
        timestamp: new Date().toISOString()
      });
      console.groupEnd();

      // Update speaking state based on message source
      if (message.source === 'ai') {
        setState(prev => ({ ...prev, isSpeaking: true }));
        serviceRef.current.updateSession({ isSpeaking: true });
        
        // Reset speaking state after a delay (simulate speaking duration)
        setTimeout(() => {
          setState(prev => ({ ...prev, isSpeaking: false }));
          serviceRef.current.updateSession({ isSpeaking: false });
        }, 3000);
        
        // Process AI message for intelligent UI actions
        const processIntelligentUI = async () => {
          try {
            const { intelligentUIService } = await import('../services/intelligentUIService');
            // Set a shorter delay for AI-triggered auto-navigation
            intelligentUIService.setAutoNavigationDelay(2500); // 2.5 seconds between agents
            await intelligentUIService.processMessage(message.message);
          } catch (error) {
            console.error('❌ [INTELLIGENT UI] Error processing AI message:', error);
          }
        };
        processIntelligentUI();
      }
      
      // Dispatch custom event for conversation tracking
      const messageEvent = new CustomEvent('elevenlabs-message', {
        detail: {
          message: message.message,
          source: message.source
        }
      });
      window.dispatchEvent(messageEvent);
    },
    onToolCall: (toolCall) => {
      console.group('🛠️ [ELEVENLABS] TOOL CALL EVENT');
      console.log('🛠️ [ELEVENLABS] Tool call from agent:', toolCall);
      console.log('📋 [ELEVENLABS] Tool call details:', {
        name: toolCall.name,
        arguments: toolCall.arguments,
        timestamp: new Date().toISOString()
      });
      console.groupEnd();
    }
  });

  /**
   * Initialize voice chat session with real ElevenLabs connection
   */
  const initializeVoiceChat = useCallback(async (contextOptions?: VoiceContextOptions) => {
    console.group('🚀 [ELEVENLABS] INITIALIZE_VOICE_CHAT');
    console.log('⏱️ Start Time:', new Date().toISOString());
    console.log('🎯 [ELEVENLABS] Context Options:', contextOptions);
    
    setState(prev => ({ ...prev, isConnecting: true, error: null }));
    
    try {
      console.log('🔧 [ELEVENLABS] Registering client tools...');
      console.log('🛠️ [ELEVENLABS] Available tools:', [
        'get_agent_status',
        'get_performance_metrics', 
        'get_alerts',
        'get_agent_details',
        'get_about_platform'
      ]);
      
      console.log('🔄 [ELEVENLABS] Starting session with ElevenLabs...');
      
      // Determine context based on options or defaults
      const agentType = contextOptions?.agentType || 'assistant agent';
      const uiContext = contextOptions?.uiContext || 'main';
      const subAgentOutputLength = contextOptions?.subAgentOutputs?.length || 0;
      
      console.log('🎯 [ELEVENLABS] Using context:', { agentType, uiContext, subAgentOutputLength});
      
      // Set dynamic variables based on context
      const dynamicVariables: any = {
        agentType: agentType,
        ui_context: uiContext
      };
      
      // Add platform and organization for AIInputModal (user proxy) context
      if (agentType === 'user proxy') {
        dynamicVariables.platform = '';
        dynamicVariables.organization = '';

        // Add invoice processing data if provided
        if (contextOptions?.invoiceData) {
          console.log('📄 [ELEVENLABS] Adding invoice processing data:', contextOptions.invoiceData);
          dynamicVariables.invoiceProcessingData = JSON.stringify(contextOptions.invoiceData);
        }

        // Add production simulation data if provided
        if (contextOptions?.invoiceData?.productionSimulationResults) {
          console.log('🏭 [ELEVENLABS] Adding production simulation data:', contextOptions.invoiceData.productionSimulationResults);
          dynamicVariables.productionSimulationData = JSON.stringify(contextOptions.invoiceData.productionSimulationResults);
        }

        // Add quality anomaly detection data if provided
        if (contextOptions?.invoiceData?.qualityAnomaliesDetected) {
          console.log('🔍 [ELEVENLABS] Adding quality anomaly data:', contextOptions.invoiceData.qualityAnomaliesDetected);
          dynamicVariables.qualityAnomalyData = JSON.stringify(contextOptions.invoiceData.qualityAnomaliesDetected);
        }
        // Add recommended options if provided
        if (contextOptions?.subAgentOutputs?.length > 0) {
          console.log('🎯 [ELEVENLABS] Adding recommended options:', subAgentOutputLength, contextOptions.subAgentOutputs);
          dynamicVariables.recommended_options = JSON.stringify(
            contextOptions.subAgentOutputs.map(output => ({
              title: output.title,
              content: output.content,
              options: output.options || []
            }))
          );
          console.log('🎯 [ELEVENLABS] Recommended options JSON:', dynamicVariables.recommended_options);
        } 
        
      } else {
        // For assistant agent (main chat), use existing values
        dynamicVariables.platform = 'Enterprise AI Agents Platform';
        dynamicVariables.organization = currentOrg?.name || 'Holding';
        dynamicVariables.ui_context='';

        // Add AI Agents data for FloatingChat conversations
        try {
          console.log('🤖 [ELEVENLABS] Loading AI Agents data for organization:', selectedOrganization);
          const allAgents = await AgentDataService.getAgents();
          const organizationAgents = selectedOrganization 
            ? allAgents.filter(agent => agent.organizationId === selectedOrganization)
            : allAgents;
          
          console.log('🤖 [ELEVENLABS] Found agents:', {
            total: allAgents.length,
            filtered: organizationAgents.length,
            organizationId: selectedOrganization
          });
          
          // Create simplified agent data for AI context
          const aiAgentsData = organizationAgents.map(agent => ({
            id: agent.id,
            name: agent.name,
            goals: agent.goals,
            description: agent.description,
            status: agent.status,
            capabilities: agent.capabilities,
            businessBenefit: agent.businessBenefit,
            metrics: {
              uptime: agent.metrics.uptime,
              responseTime: agent.metrics.responseTime,
              tasksCompleted: agent.metrics.tasksCompleted,
              errorRate: agent.metrics.errorRate
            }
          }));
          
          dynamicVariables.AIAgents = JSON.stringify(aiAgentsData);
          console.log('🤖 [ELEVENLABS] AI Agents JSON added:', {
            agentCount: aiAgentsData.length,
            jsonLength: dynamicVariables.AIAgents.length
          });
          
          // Add Agent Inputs data for FloatingChat conversations
          console.log('📥 [ELEVENLABS] Loading Agent Inputs data for organization agents');
          const agentInputsData = [];
          
          for (const agent of organizationAgents) {
            try {
              const recentInputs = await AgentInputsService.getRecentRecords(agent.id, 5);
              if (recentInputs.length > 0) {
                agentInputsData.push({
                  agentId: agent.id,
                  agentName: agent.name,
                  recentInputs: recentInputs.map(input => ({
                    id: input.id,
                    timestamp: input.timestamp,
                    eventType: input.eventType,
                    dataSourceSystem: input.dataSourceSystem,
                    data: input.data,
                    status: input.status
                  }))
                });
              }
            } catch (error) {
              console.error(`❌ [ELEVENLABS] Error loading inputs for agent ${agent.id}:`, error);
            }
          }
          
          dynamicVariables.AgentInputs = JSON.stringify(agentInputsData);
          console.log('📥 [ELEVENLABS] Agent Inputs JSON added:', {
            agentsWithInputs: agentInputsData.length,
            totalInputRecords: agentInputsData.reduce((sum, agent) => sum + agent.recentInputs.length, 0),
            jsonLength: dynamicVariables.AgentInputs.length
          });
          
          // Add Agent Statistics data for FloatingChat conversations
          console.log('📊 [ELEVENLABS] Loading Agent Statistics data for organization agents');
          const agentStatisticsData = [];
          
          for (const agent of organizationAgents) {
            try {
              const recentStats = await AgentStatisticsService.getRecentStatistics(agent.id, 7);
              const avgMetrics = await AgentStatisticsService.getAverageMetrics(agent.id, 7);
              
              if (recentStats.length > 0) {
                agentStatisticsData.push({
                  agentId: agent.id,
                  agentName: agent.name,
                  recentStatistics: recentStats.map(stat => ({
                    date: stat.date,
                    uptime: stat.uptime,
                    responseTime: stat.responseTime,
                    tasksCompleted: stat.tasksCompleted,
                    errorRate: stat.errorRate,
                    throughput: stat.throughput,
                    memoryUsage: stat.memoryUsage,
                    cpuUsage: stat.cpuUsage
                  })),
                  weeklyAverages: {
                    avgUptime: avgMetrics.avgUptime,
                    avgResponseTime: avgMetrics.avgResponseTime,
                    avgThroughput: avgMetrics.avgThroughput,
                    avgErrorRate: avgMetrics.avgErrorRate
                  }
                });
              }
            } catch (error) {
              console.error(`❌ [ELEVENLABS] Error loading statistics for agent ${agent.id}:`, error);
            }
          }
          
          dynamicVariables.AgentStatistics = JSON.stringify(agentStatisticsData);
          console.log('📊 [ELEVENLABS] Agent Statistics JSON added:', {
            agentsWithStats: agentStatisticsData.length,
            totalStatRecords: agentStatisticsData.reduce((sum, agent) => sum + agent.recentStatistics.length, 0),
            jsonLength: dynamicVariables.AgentStatistics.length
          });
          
        } catch (error) {
          console.error('❌ [ELEVENLABS] Error loading AI Agents data:', error);
          dynamicVariables.AIAgents = JSON.stringify([]);
          dynamicVariables.AgentInputs = JSON.stringify([]);
          dynamicVariables.AgentStatistics = JSON.stringify([]);
        }
        
      }  
      
      console.log('🎯 [ELEVENLABS] Dynamic variables:', dynamicVariables);
      
      const sessionId = await conversation.startSession({
        dynamicVariables,
        clientTools: {
          get_agent_details: (input: any) => getAgentDetailsHandler(input, selectedOrganization),
          get_about_platform: (input: any) => getAboutPlatformHandler(input, selectedOrganization)
        }
      });
      
      console.log('✅ [ELEVENLABS] ElevenLabs session started successfully');
      console.log('🆔 [ELEVENLABS] Session ID:', sessionId);
      
      // Create session in service
      serviceRef.current.createSession(sessionId);
      
      setState(prev => ({ 
        ...prev, 
        sessionId, 
        isConnecting: false,
        isConnected: true 
      }));
      
      console.log('⏱️ End Time:', new Date().toISOString());
      console.groupEnd();
      
    } catch (error) {
      console.error('❌ [ELEVENLABS] Failed to start ElevenLabs session:', error);
      console.error('🔍 [ELEVENLABS] Session start error details:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      setState(prev => ({ 
        ...prev, 
        error: error.message, 
        isConnecting: false 
      }));
      
      console.log('⏱️ End Time:', new Date().toISOString());
      console.groupEnd();
      
      throw error;
    }
  }, [conversation]);

  /**
   * Start recording voice input (real microphone activation)
   */
  const startRecording = useCallback(async () => {
    if (!state.isConnected) {
      throw new Error('Voice chat not connected');
    }

    console.log('🎙️ [ELEVENLABS] Starting voice recording...');
    
    setState(prev => ({ ...prev, isRecording: true }));
    serviceRef.current.updateSession({ isRecording: true });
    
    // The actual recording is handled by ElevenLabs SDK
    // We just update our state to reflect the recording status
  }, [state.isConnected]);

  /**
   * Stop recording and process voice input (real voice processing)
   */
  const stopRecording = useCallback(async (): Promise<string> => {
    if (!state.isRecording) {
      throw new Error('No active recording session');
    }

    console.log('🛑 [ELEVENLABS] Stopping voice recording...');
    
    setState(prev => ({ ...prev, isRecording: false }));
    serviceRef.current.updateSession({ isRecording: false });

    // The actual voice processing is handled by ElevenLabs SDK
    // Return a confirmation message
    return 'Voice input processed successfully. The AI agent is analyzing your request.';
  }, [state.isRecording]);

  /**
   * End voice chat session (real disconnection)
   */
  const endVoiceChat = useCallback(async () => {
    console.group('🛑 [ELEVENLABS] END_VOICE_CHAT');
    console.log('⏱️ Start Time:', new Date().toISOString());
    const currentSessionId = state.sessionId;
    console.log('🆔 [ELEVENLABS] Session ID:', currentSessionId);
    
    setState(prev => ({ ...prev, isConnecting: true }));
    
    try {
      console.log('🔄 [ELEVENLABS] Ending session with ElevenLabs...');
      await conversation.endSession();
      console.log('✅ [ELEVENLABS] ElevenLabs session ended successfully');
      
      // Clear session in service
      serviceRef.current.clearSession();
      
      setState(prev => ({ 
        ...prev, 
        sessionId: null, 
        isConnecting: false,
        isConnected: false,
        isRecording: false,
        isSpeaking: false
      }));
      
      console.log('⏱️ End Time:', new Date().toISOString());
      console.groupEnd();
      
    } catch (error) {
      console.error('❌ [ELEVENLABS] Failed to end ElevenLabs session:', error);
      console.error('🔍 [ELEVENLABS] Session end error details:', {
        message: error.message,
        stack: error.stack,
        sessionId: currentSessionId,
        timestamp: new Date().toISOString()
      });
      
      setState(prev => ({ 
        ...prev, 
        error: error.message, 
        isConnecting: false 
      }));
      
      console.log('⏱️ End Time:', new Date().toISOString());
      console.groupEnd();
      
      throw error;
    }
  }, [conversation, state.sessionId]);

  /**
   * Reset error state
   */
  const resetError = useCallback(() => {
    console.log('🧹 [ELEVENLABS] Clearing error state');
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (state.isConnected) {
        conversation.endSession().catch(console.error);
      }
    };
  }, []);

  return {
    // State
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    connectionError: state.error,
    isRecording: state.isRecording,
    isSpeaking: state.isSpeaking,
    session: serviceRef.current.getSessionStatus(),
    
    // Actions
    initializeVoiceChat,
    startRecording,
    stopRecording,
    endVoiceChat,
    resetError
  };
}