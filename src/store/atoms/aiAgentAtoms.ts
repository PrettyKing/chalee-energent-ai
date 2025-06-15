// AI Agent-related Jotai atoms for state management
import { atom } from 'jotai';
import { produce } from 'immer';
import type { AIAgent, AgentPerformance } from '../../types';

// AI Agent state interface
interface AIAgentState {
  agents: AIAgent[];
  activeAgent: AIAgent | null;
  isProcessing: boolean;
  lastResponse: string | null;
  conversationHistory: ConversationEntry[];
  error: string | null;
  streamingMessage: StreamingMessage | null;
}

interface ConversationEntry {
  id: string;
  agentId: string;
  userInput: string;
  agentResponse: string;
  timestamp: Date;
  responseTime: number;
  tokens: {
    input: number;
    output: number;
  };
}

interface StreamingMessage {
  id: string;
  content: string;
  isComplete: boolean;
  startTime: Date;
}

const initialAIAgentState: AIAgentState = {
  agents: [],
  activeAgent: null,
  isProcessing: false,
  lastResponse: null,
  conversationHistory: [],
  error: null,
  streamingMessage: null,
};

// Base AI agent atom
export const aiAgentAtom = atom(initialAIAgentState);

// Derived atoms
export const activeAgentAtom = atom(
  (get) => get(aiAgentAtom).activeAgent
);

export const availableAgentsAtom = atom(
  (get) => {
    return get(aiAgentAtom).agents.filter(
      agent => agent.status === 'idle' || agent.status === 'processing'
    );
  }
);

export const isProcessingAtom = atom(
  (get) => get(aiAgentAtom).isProcessing
);

export const conversationHistoryAtom = atom(
  (get) => get(aiAgentAtom).conversationHistory
);

export const streamingMessageAtom = atom(
  (get) => get(aiAgentAtom).streamingMessage
);

export const errorAtom = atom(
  (get) => get(aiAgentAtom).error
);

// Write-only atoms for actions
export const setActiveAgentAtom = atom(
  null,
  (get, set, agent: AIAgent | null) => {
    set(aiAgentAtom, produce(get(aiAgentAtom), (draft) => {
      draft.activeAgent = agent;
      draft.error = null;
    }));
  }
);

export const addAgentAtom = atom(
  null,
  (get, set, agent: AIAgent) => {
    set(aiAgentAtom, produce(get(aiAgentAtom), (draft) => {
      const existingIndex = draft.agents.findIndex(a => a.id === agent.id);
      if (existingIndex !== -1) {
        draft.agents[existingIndex] = agent;
      } else {
        draft.agents.push(agent);
      }
    }));
  }
);

export const removeAgentAtom = atom(
  null,
  (get, set, agentId: string) => {
    set(aiAgentAtom, produce(get(aiAgentAtom), (draft) => {
      draft.agents = draft.agents.filter(a => a.id !== agentId);
      if (draft.activeAgent?.id === agentId) {
        draft.activeAgent = null;
      }
    }));
  }
);

export const updateAgentStatusAtom = atom(
  null,
  (get, set, agentId: string, status: AIAgent['status']) => {
    set(aiAgentAtom, produce(get(aiAgentAtom), (draft) => {
      const agent = draft.agents.find(a => a.id === agentId);
      if (agent) {
        agent.status = status;
        agent.lastActiveAt = new Date();
      }
      if (draft.activeAgent?.id === agentId) {
        draft.activeAgent.status = status;
        draft.activeAgent.lastActiveAt = new Date();
      }
    }));
  }
);

export const setProcessingAtom = atom(
  null,
  (get, set, processing: boolean) => {
    set(aiAgentAtom, produce(get(aiAgentAtom), (draft) => {
      draft.isProcessing = processing;
      if (!processing) {
        draft.streamingMessage = null;
      }
    }));
  }
);

export const setErrorAtom = atom(
  null,
  (get, set, error: string | null) => {
    set(aiAgentAtom, produce(get(aiAgentAtom), (draft) => {
      draft.error = error;
      draft.isProcessing = false;
    }));
  }
);

export const startStreamingMessageAtom = atom(
  null,
  (get, set, messageId: string) => {
    set(aiAgentAtom, produce(get(aiAgentAtom), (draft) => {
      draft.streamingMessage = {
        id: messageId,
        content: '',
        isComplete: false,
        startTime: new Date(),
      };
      draft.isProcessing = true;
    }));
  }
);

export const updateStreamingMessageAtom = atom(
  null,
  (get, set, chunk: string) => {
    set(aiAgentAtom, produce(get(aiAgentAtom), (draft) => {
      if (draft.streamingMessage) {
        draft.streamingMessage.content += chunk;
      }
    }));
  }
);

export const completeStreamingMessageAtom = atom(
  null,
  (get, set) => {
    set(aiAgentAtom, produce(get(aiAgentAtom), (draft) => {
      if (draft.streamingMessage) {
        draft.streamingMessage.isComplete = true;
        draft.lastResponse = draft.streamingMessage.content;
        draft.isProcessing = false;
      }
    }));
  }
);

export const addConversationEntryAtom = atom(
  null,
  (get, set, entry: ConversationEntry) => {
    set(aiAgentAtom, produce(get(aiAgentAtom), (draft) => {
      draft.conversationHistory.push(entry);
      // Keep only last 50 entries to manage memory
      if (draft.conversationHistory.length > 50) {
        draft.conversationHistory = draft.conversationHistory.slice(-50);
      }
    }));
  }
);

export const updateAgentPerformanceAtom = atom(
  null,
  (get, set, agentId: string, performance: Partial<AgentPerformance>) => {
    set(aiAgentAtom, produce(get(aiAgentAtom), (draft) => {
      const agent = draft.agents.find(a => a.id === agentId);
      if (agent) {
        Object.assign(agent.performance, performance);
        agent.performance.lastEvaluatedAt = new Date();
      }
      if (draft.activeAgent?.id === agentId) {
        Object.assign(draft.activeAgent.performance, performance);
        draft.activeAgent.performance.lastEvaluatedAt = new Date();
      }
    }));
  }
);

export const clearConversationHistoryAtom = atom(
  null,
  (get, set) => {
    set(aiAgentAtom, produce(get(aiAgentAtom), (draft) => {
      draft.conversationHistory = [];
    }));
  }
);

// Computed atoms
export const agentCountByStatusAtom = atom(
  (get) => {
    const agents = get(aiAgentAtom).agents;
    return agents.reduce((acc, agent) => {
      acc[agent.status] = (acc[agent.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
);

export const averageResponseTimeAtom = atom(
  (get) => {
    const history = get(aiAgentAtom).conversationHistory;
    if (history.length === 0) return 0;
    
    const totalTime = history.reduce((sum, entry) => sum + entry.responseTime, 0);
    return totalTime / history.length;
  }
);

export const totalTokensUsedAtom = atom(
  (get) => {
    const history = get(aiAgentAtom).conversationHistory;
    return history.reduce((acc, entry) => ({
      input: acc.input + entry.tokens.input,
      output: acc.output + entry.tokens.output,
    }), { input: 0, output: 0 });
  }
);

export const activeAgentCapabilitiesAtom = atom(
  (get) => {
    const activeAgent = get(aiAgentAtom).activeAgent;
    return activeAgent?.capabilities.filter(cap => cap.enabled) || [];
  }
);

export const conversationStatsAtom = atom(
  (get) => {
    const history = get(aiAgentAtom).conversationHistory;
    const last24Hours = history.filter(
      entry => Date.now() - entry.timestamp.getTime() < 24 * 60 * 60 * 1000
    );
    
    return {
      total: history.length,
      last24Hours: last24Hours.length,
      avgResponseTime: get(averageResponseTimeAtom),
      totalTokens: get(totalTokensUsedAtom),
    };
  }
);
