import React, { createContext, useContext, useState, useEffect } from 'react';
import { Agent, AgentStatus, AgentOutput } from '../types/agent';
import agentOutputsData from '../data/agentOutputs.json';
import { AgentDataService } from '../services/agentDataService';

interface AgentContextType {
  agents: Agent[];
  agentOutputs: AgentOutput[];
  loading: boolean;
  updateAgentStatus: (agentId: string, status: AgentStatus) => void;
  getAgentOutput: (agentId: string) => AgentOutput | undefined;
  refreshAgents: () => Promise<void>;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agentList, setAgentList] = useState<Agent[]>([]);
  const [outputs] = useState<AgentOutput[]>(agentOutputsData);
  const [loading, setLoading] = useState(true);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const agents = await AgentDataService.getAgents();
      console.log('Loaded agents from database:', agents.length, agents);
      setAgentList(agents);
    } catch (error) {
      console.error('Error loading agents:', error);
      setAgentList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const updateAgentStatus = (agentId: string, status: AgentStatus) => {
    setAgentList(prev =>
      prev.map(agent =>
        agent.id === agentId ? { ...agent, status } : agent
      )
    );
    AgentDataService.updateAgentStatus(agentId, status);
  };

  const getAgentOutput = (agentId: string) => {
    return outputs.find(output => output.agentId === agentId);
  };

  const refreshAgents = async () => {
    await loadAgents();
  };

  return (
    <AgentContext.Provider value={{
      agents: agentList,
      agentOutputs: outputs,
      loading,
      updateAgentStatus,
      getAgentOutput,
      refreshAgents
    }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within AgentProvider');
  }
  return context;
};