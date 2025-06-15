// Chat-related Jotai atoms for state management
import { atom } from 'jotai';
import { produce } from 'immer';
import type { ChatSession, Message, MessageSender } from '../../types';

// Basic chat state
interface ChatState {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoading: boolean;
  error: string | null;
  isTyping: boolean;
  typingUsers: MessageSender[];
}

const initialChatState: ChatState = {
  currentSession: null,
  sessions: [],
  isLoading: false,
  error: null,
  isTyping: false,
  typingUsers: [],
};

// Base chat atom
export const chatAtom = atom(initialChatState);

// Derived atoms
export const currentSessionAtom = atom(
  (get) => get(chatAtom).currentSession
);

export const currentMessagesAtom = atom(
  (get) => get(chatAtom).currentSession?.messages || []
);

export const isLoadingAtom = atom(
  (get) => get(chatAtom).isLoading
);

export const errorAtom = atom(
  (get) => get(chatAtom).error
);

// Write-only atoms for actions
export const setCurrentSessionAtom = atom(
  null,
  (get, set, session: ChatSession | null) => {
    set(chatAtom, produce(get(chatAtom), (draft) => {
      draft.currentSession = session;
      draft.error = null;
    }));
  }
);

export const addMessageAtom = atom(
  null,
  (get, set, message: Message) => {
    set(chatAtom, produce(get(chatAtom), (draft) => {
      if (draft.currentSession) {
        draft.currentSession.messages.push(message);
        draft.currentSession.updatedAt = new Date();
      }
    }));
  }
);

export const updateMessageAtom = atom(
  null,
  (get, set, messageId: string, updates: Partial<Message>) => {
    set(chatAtom, produce(get(chatAtom), (draft) => {
      if (draft.currentSession) {
        const messageIndex = draft.currentSession.messages.findIndex(
          (msg) => msg.id === messageId
        );
        if (messageIndex !== -1) {
          Object.assign(draft.currentSession.messages[messageIndex], updates);
        }
      }
    }));
  }
);

export const removeMessageAtom = atom(
  null,
  (get, set, messageId: string) => {
    set(chatAtom, produce(get(chatAtom), (draft) => {
      if (draft.currentSession) {
        draft.currentSession.messages = draft.currentSession.messages.filter(
          (msg) => msg.id !== messageId
        );
      }
    }));
  }
);

export const setLoadingAtom = atom(
  null,
  (get, set, loading: boolean) => {
    set(chatAtom, produce(get(chatAtom), (draft) => {
      draft.isLoading = loading;
    }));
  }
);

export const setErrorAtom = atom(
  null,
  (get, set, error: string | null) => {
    set(chatAtom, produce(get(chatAtom), (draft) => {
      draft.error = error;
      draft.isLoading = false;
    }));
  }
);

export const setTypingAtom = atom(
  null,
  (get, set, isTyping: boolean) => {
    set(chatAtom, produce(get(chatAtom), (draft) => {
      draft.isTyping = isTyping;
    }));
  }
);

export const addTypingUserAtom = atom(
  null,
  (get, set, user: MessageSender) => {
    set(chatAtom, produce(get(chatAtom), (draft) => {
      const exists = draft.typingUsers.some((u) => u.id === user.id);
      if (!exists) {
        draft.typingUsers.push(user);
      }
    }));
  }
);

export const removeTypingUserAtom = atom(
  null,
  (get, set, userId: string) => {
    set(chatAtom, produce(get(chatAtom), (draft) => {
      draft.typingUsers = draft.typingUsers.filter((u) => u.id !== userId);
    }));
  }
);

export const clearChatAtom = atom(
  null,
  (get, set) => {
    set(chatAtom, initialChatState);
  }
);

// Computed atoms
export const unreadMessagesCountAtom = atom(
  (get) => {
    const sessions = get(chatAtom).sessions;
    return sessions.reduce((count, session) => {
      return count + session.messages.filter(msg => 
        !msg.metadata?.readBy?.includes('current-user-id')
      ).length;
    }, 0);
  }
);

export const lastMessageAtom = atom(
  (get) => {
    const messages = get(currentMessagesAtom);
    return messages.length > 0 ? messages[messages.length - 1] : null;
  }
);

export const isTypingDisplayAtom = atom(
  (get) => {
    const typingUsers = get(chatAtom).typingUsers;
    return typingUsers.length > 0;
  }
);

export const typingIndicatorTextAtom = atom(
  (get) => {
    const typingUsers = get(chatAtom).typingUsers;
    if (typingUsers.length === 0) return '';
    if (typingUsers.length === 1) return `${typingUsers[0].name} is typing...`;
    if (typingUsers.length === 2) {
      return `${typingUsers[0].name} and ${typingUsers[1].name} are typing...`;
    }
    return `${typingUsers[0].name} and ${typingUsers.length - 1} others are typing...`;
  }
);
