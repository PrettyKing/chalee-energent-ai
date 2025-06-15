// VNC-related Jotai atoms for state management
import { atom } from 'jotai';
import { produce } from 'immer';
import type { VNCSession, VNCQuality, VNCViewport } from '../../types';

// VNC state interface
interface VNCState {
  sessions: VNCSession[];
  activeSession: VNCSession | null;
  isConnecting: boolean;
  connectionError: string | null;
  performance: VNCPerformanceMetrics;
  settings: VNCSettings;
}

interface VNCPerformanceMetrics {
  frameRate: number;
  latency: number;
  bandwidth: number;
  packetLoss: number;
  lastUpdated: Date;
}

interface VNCSettings {
  defaultQuality: VNCQuality;
  autoReconnect: boolean;
  showCursor: boolean;
  viewOnly: boolean;
  clipboardSync: boolean;
}

const initialVNCState: VNCState = {
  sessions: [],
  activeSession: null,
  isConnecting: false,
  connectionError: null,
  performance: {
    frameRate: 0,
    latency: 0,
    bandwidth: 0,
    packetLoss: 0,
    lastUpdated: new Date(),
  },
  settings: {
    defaultQuality: {
      compression: 6,
      jpegQuality: 6,
      colorDepth: 24,
      frameRate: 30,
    },
    autoReconnect: true,
    showCursor: true,
    viewOnly: false,
    clipboardSync: true,
  },
};

// Base VNC atom
export const vncAtom = atom(initialVNCState);

// Derived atoms
export const activeSessionAtom = atom(
  (get) => get(vncAtom).activeSession
);

export const isConnectedAtom = atom(
  (get) => {
    const session = get(vncAtom).activeSession;
    return session?.status === 'connected';
  }
);

export const isConnectingAtom = atom(
  (get) => get(vncAtom).isConnecting
);

export const connectionErrorAtom = atom(
  (get) => get(vncAtom).connectionError
);

export const performanceMetricsAtom = atom(
  (get) => get(vncAtom).performance
);

export const vncSettingsAtom = atom(
  (get) => get(vncAtom).settings
);

export const viewportAtom = atom(
  (get) => get(vncAtom).activeSession?.viewport || null
);

// Write-only atoms for actions
export const setActiveSessionAtom = atom(
  null,
  (get, set, session: VNCSession | null) => {
    set(vncAtom, produce(get(vncAtom), (draft) => {
      draft.activeSession = session;
      draft.connectionError = null;
    }));
  }
);

export const addSessionAtom = atom(
  null,
  (get, set, session: VNCSession) => {
    set(vncAtom, produce(get(vncAtom), (draft) => {
      const existingIndex = draft.sessions.findIndex(s => s.id === session.id);
      if (existingIndex !== -1) {
        draft.sessions[existingIndex] = session;
      } else {
        draft.sessions.push(session);
      }
    }));
  }
);

export const removeSessionAtom = atom(
  null,
  (get, set, sessionId: string) => {
    set(vncAtom, produce(get(vncAtom), (draft) => {
      draft.sessions = draft.sessions.filter(s => s.id !== sessionId);
      if (draft.activeSession?.id === sessionId) {
        draft.activeSession = null;
      }
    }));
  }
);

export const updateSessionStatusAtom = atom(
  null,
  (get, set, sessionId: string, status: VNCSession['status']) => {
    set(vncAtom, produce(get(vncAtom), (draft) => {
      const session = draft.sessions.find(s => s.id === sessionId);
      if (session) {
        session.status = status;
        session.lastActiveAt = new Date();
      }
      if (draft.activeSession?.id === sessionId) {
        draft.activeSession.status = status;
        draft.activeSession.lastActiveAt = new Date();
      }
    }));
  }
);

export const setConnectingAtom = atom(
  null,
  (get, set, connecting: boolean) => {
    set(vncAtom, produce(get(vncAtom), (draft) => {
      draft.isConnecting = connecting;
      if (connecting) {
        draft.connectionError = null;
      }
    }));
  }
);

export const setConnectionErrorAtom = atom(
  null,
  (get, set, error: string | null) => {
    set(vncAtom, produce(get(vncAtom), (draft) => {
      draft.connectionError = error;
      draft.isConnecting = false;
    }));
  }
);

export const updatePerformanceMetricsAtom = atom(
  null,
  (get, set, metrics: Partial<VNCPerformanceMetrics>) => {
    set(vncAtom, produce(get(vncAtom), (draft) => {
      Object.assign(draft.performance, metrics);
      draft.performance.lastUpdated = new Date();
    }));
  }
);

export const updateVNCSettingsAtom = atom(
  null,
  (get, set, settings: Partial<VNCSettings>) => {
    set(vncAtom, produce(get(vncAtom), (draft) => {
      Object.assign(draft.settings, settings);
    }));
  }
);

export const updateViewportAtom = atom(
  null,
  (get, set, viewport: Partial<VNCViewport>) => {
    set(vncAtom, produce(get(vncAtom), (draft) => {
      if (draft.activeSession) {
        Object.assign(draft.activeSession.viewport, viewport);
      }
    }));
  }
);

// Computed atoms
export const connectionQualityAtom = atom(
  (get) => {
    const performance = get(vncAtom).performance;
    const { latency, packetLoss, frameRate } = performance;
    
    // Calculate quality score based on performance metrics
    let score = 100;
    if (latency > 200) score -= 30;
    else if (latency > 100) score -= 15;
    
    if (packetLoss > 5) score -= 40;
    else if (packetLoss > 1) score -= 20;
    
    if (frameRate < 15) score -= 25;
    else if (frameRate < 25) score -= 10;
    
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  }
);

export const sessionCountAtom = atom(
  (get) => get(vncAtom).sessions.length
);

export const activeSessionsAtom = atom(
  (get) => {
    return get(vncAtom).sessions.filter(
      session => session.status === 'connected' || session.status === 'connecting'
    );
  }
);
