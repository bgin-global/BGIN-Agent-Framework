// =====================================
// frontend/src/contexts/AgentContext.tsx
// =====================================

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Agent {
  id: string;
  type: 'archive' | 'codex' | 'discourse';
  name: string;
  status: 'active' | 'inactive' | 'processing';
  sessionId: string;
}

interface AgentContextType {
  agents: Agent[];
  activeAgents: Agent[];
  setActiveAgents: (agents: Agent[]) => void;
  getAgentByType: (type: string) => Agent | undefined;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const useAgents = () => {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgents must be used within an AgentProvider');
  }
  return context;
};

interface AgentProviderProps {
  children: ReactNode;
}

export const AgentProvider: React.FC<AgentProviderProps> = ({ children }) => {
  const [agents] = useState<Agent[]>([
    {
      id: '1',
      type: 'archive',
      name: 'Archive Agent',
      status: 'active',
      sessionId: 'keynote'
    },
    {
      id: '2',
      type: 'codex',
      name: 'Codex Agent',
      status: 'active',
      sessionId: 'keynote'
    },
    {
      id: '3',
      type: 'discourse',
      name: 'Discourse Agent',
      status: 'active',
      sessionId: 'keynote'
    }
  ]);

  const [activeAgents, setActiveAgents] = useState<Agent[]>(agents);

  const getAgentByType = (type: string) => {
    return agents.find(agent => agent.type === type);
  };

  const value: AgentContextType = {
    agents,
    activeAgents,
    setActiveAgents,
    getAgentByType
  };

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
};
