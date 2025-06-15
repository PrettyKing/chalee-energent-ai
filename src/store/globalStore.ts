// Global Zustand store for application-wide state management
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import type { AppSettings, PerformanceMetrics, SecurityEvent } from '../../types';
import { STORAGE_KEYS } from '../../constants';

// Global app state interface
interface GlobalState {
  // App configuration
  isInitialized: boolean;
  version: string;
  environment: 'development' | 'staging' | 'production';
  
  // App settings
  settings: AppSettings;
  
  // Performance monitoring
  performance: {
    metrics: PerformanceMetrics[];
    isMonitoring: boolean;
    alerts: PerformanceAlert[];
  };
  
  // Security
  security: {
    events: SecurityEvent[];
    isSecure: boolean;
    lastSecurityCheck: Date | null;
  };
  
  // Feature flags
  features: Record<string, boolean>;
  
  // Connection status
  connectivity: {
    isOnline: boolean;
    apiStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
    wsStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
    lastConnected: Date | null;
  };
  
  // Debug information
  debug: {
    enabled: boolean;
    logs: DebugLog[];
    errors: ErrorLog[];
  };
}

interface PerformanceAlert {
  id: string;
  type: 'memory' | 'bundle' | 'render' | 'network';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  resolved: boolean;
}

interface DebugLog {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  data?: any;
  timestamp: Date;
}

interface ErrorLog {
  id: string;
  error: Error;
  stack?: string;
  context?: string;
  timestamp: Date;
  user?: string;
}

// Actions interface
interface GlobalActions {
  // Initialization
  initialize: () => void;
  setInitialized: (initialized: boolean) => void;
  
  // Settings
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  
  // Performance
  addPerformanceMetric: (metric: PerformanceMetrics) => void;
  togglePerformanceMonitoring: () => void;
  addPerformanceAlert: (alert: Omit<PerformanceAlert, 'id' | 'timestamp'>) => void;
  resolvePerformanceAlert: (alertId: string) => void;
  clearPerformanceData: () => void;
  
  // Security
  addSecurityEvent: (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => void;
  updateSecurityStatus: (isSecure: boolean) => void;
  performSecurityCheck: () => void;
  
  // Feature flags
  setFeatureFlag: (feature: string, enabled: boolean) => void;
  toggleFeatureFlag: (feature: string) => void;
  
  // Connectivity
  setOnlineStatus: (isOnline: boolean) => void;
  updateApiStatus: (status: GlobalState['connectivity']['apiStatus']) => void;
  updateWsStatus: (status: GlobalState['connectivity']['wsStatus']) => void;
  
  // Debug
  toggleDebug: () => void;
  addDebugLog: (log: Omit<DebugLog, 'id' | 'timestamp'>) => void;
  addErrorLog: (error: Error, context?: string) => void;
  clearDebugLogs: () => void;
  
  // Utility
  reset: () => void;
}

type GlobalStore = GlobalState & GlobalActions;

// Default state
const defaultSettings: AppSettings = {
  autoSave: true,
  saveInterval: 30000, // 30 seconds
  defaultAgent: 'gpt-4',
  defaultVNCQuality: {
    compression: 6,
    jpegQuality: 6,
    colorDepth: 24,
    frameRate: 30,
  },
  analytics: true,
  crashReporting: true,
};

const initialState: GlobalState = {
  isInitialized: false,
  version: '1.0.0',
  environment: import.meta.env.MODE as 'development' | 'staging' | 'production',
  
  settings: defaultSettings,
  
  performance: {
    metrics: [],
    isMonitoring: import.meta.env.DEV,
    alerts: [],
  },
  
  security: {
    events: [],
    isSecure: true,
    lastSecurityCheck: null,
  },
  
  features: {
    aiStreaming: true,
    vncCompression: true,
    performanceMonitoring: true,
    securityLogging: true,
    offlineMode: false,
    experimentalFeatures: false,
    debugMode: import.meta.env.DEV,
  },
  
  connectivity: {
    isOnline: navigator.onLine,
    apiStatus: 'disconnected',
    wsStatus: 'disconnected',
    lastConnected: null,
  },
  
  debug: {
    enabled: import.meta.env.DEV,
    logs: [],
    errors: [],
  },
};

// Utility function to generate IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Create the store with middleware
export const useGlobalStore = create<GlobalStore>()(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        ...initialState,
        
        // Initialization
        initialize: () => {
          set((state) => {
            state.isInitialized = true;
            state.connectivity.lastConnected = new Date();
          });
        },
        
        setInitialized: (initialized) => {
          set((state) => {
            state.isInitialized = initialized;
          });
        },
        
        // Settings
        updateSettings: (settings) => {
          set((state) => {
            Object.assign(state.settings, settings);
          });
        },
        
        resetSettings: () => {
          set((state) => {
            state.settings = defaultSettings;
          });
        },
        
        // Performance
        addPerformanceMetric: (metric) => {
          set((state) => {
            state.performance.metrics.push(metric);
            
            // Keep only last 100 metrics to manage memory
            if (state.performance.metrics.length > 100) {
              state.performance.metrics = state.performance.metrics.slice(-100);
            }
            
            // Auto-generate alerts based on thresholds
            if (metric.memoryUsage > 100 * 1024 * 1024) { // 100MB
              state.performance.alerts.push({
                id: generateId(),
                type: 'memory',
                message: `High memory usage: ${(metric.memoryUsage / (1024 * 1024)).toFixed(1)}MB`,
                severity: metric.memoryUsage > 200 * 1024 * 1024 ? 'critical' : 'high',
                timestamp: new Date(),
                resolved: false,
              });
            }
            
            if (metric.renderTime > 50) { // 50ms
              state.performance.alerts.push({
                id: generateId(),
                type: 'render',
                message: `Slow render time: ${metric.renderTime}ms`,
                severity: metric.renderTime > 100 ? 'high' : 'medium',
                timestamp: new Date(),
                resolved: false,
              });
            }
          });
        },
        
        togglePerformanceMonitoring: () => {
          set((state) => {
            state.performance.isMonitoring = !state.performance.isMonitoring;
          });
        },
        
        addPerformanceAlert: (alert) => {
          set((state) => {
            state.performance.alerts.push({
              ...alert,
              id: generateId(),
              timestamp: new Date(),
            });
          });
        },
        
        resolvePerformanceAlert: (alertId) => {
          set((state) => {
            const alert = state.performance.alerts.find(a => a.id === alertId);
            if (alert) {
              alert.resolved = true;
            }
          });
        },
        
        clearPerformanceData: () => {
          set((state) => {
            state.performance.metrics = [];
            state.performance.alerts = [];
          });
        },
        
        // Security
        addSecurityEvent: (event) => {
          set((state) => {
            state.security.events.push({
              ...event,
              id: generateId(),
              timestamp: new Date(),
            });
            
            // Keep only last 1000 events
            if (state.security.events.length > 1000) {
              state.security.events = state.security.events.slice(-1000);
            }
            
            // Update security status based on event severity
            if (event.severity === 'critical' || event.severity === 'high') {
              state.security.isSecure = false;
            }
          });
        },
        
        updateSecurityStatus: (isSecure) => {
          set((state) => {
            state.security.isSecure = isSecure;
          });
        },
        
        performSecurityCheck: () => {
          set((state) => {
            state.security.lastSecurityCheck = new Date();
            
            // Simple security check - in real app this would be more comprehensive
            const recentCriticalEvents = state.security.events.filter(
              event => 
                event.severity === 'critical' && 
                Date.now() - event.timestamp.getTime() < 24 * 60 * 60 * 1000
            );
            
            state.security.isSecure = recentCriticalEvents.length === 0;
          });
        },
        
        // Feature flags
        setFeatureFlag: (feature, enabled) => {
          set((state) => {
            state.features[feature] = enabled;
          });
        },
        
        toggleFeatureFlag: (feature) => {
          set((state) => {
            state.features[feature] = !state.features[feature];
          });
        },
        
        // Connectivity
        setOnlineStatus: (isOnline) => {
          set((state) => {
            state.connectivity.isOnline = isOnline;
            if (isOnline) {
              state.connectivity.lastConnected = new Date();
            }
          });
        },
        
        updateApiStatus: (status) => {
          set((state) => {
            state.connectivity.apiStatus = status;
            if (status === 'connected') {
              state.connectivity.lastConnected = new Date();
            }
          });
        },
        
        updateWsStatus: (status) => {
          set((state) => {
            state.connectivity.wsStatus = status;
            if (status === 'connected') {
              state.connectivity.lastConnected = new Date();
            }
          });
        },
        
        // Debug
        toggleDebug: () => {
          set((state) => {
            state.debug.enabled = !state.debug.enabled;
          });
        },
        
        addDebugLog: (log) => {
          set((state) => {
            if (state.debug.enabled) {
              state.debug.logs.push({
                ...log,
                id: generateId(),
                timestamp: new Date(),
              });
              
              // Keep only last 500 logs
              if (state.debug.logs.length > 500) {
                state.debug.logs = state.debug.logs.slice(-500);
              }
            }
          });
        },
        
        addErrorLog: (error, context) => {
          set((state) => {
            state.debug.errors.push({
              id: generateId(),
              error,
              stack: error.stack,
              context,
              timestamp: new Date(),
              user: 'current-user', // In real app, get from user state
            });
            
            // Keep only last 100 errors
            if (state.debug.errors.length > 100) {
              state.debug.errors = state.debug.errors.slice(-100);
            }
          });
        },
        
        clearDebugLogs: () => {
          set((state) => {
            state.debug.logs = [];
            state.debug.errors = [];
          });
        },
        
        // Utility
        reset: () => {
          set(() => initialState);
        },
      })),
      {
        name: STORAGE_KEYS.UI_STATE,
        partialize: (state) => ({
          settings: state.settings,
          features: state.features,
          debug: { enabled: state.debug.enabled },
        }),
      }
    )
  )
);

// Selectors for better performance
export const selectSettings = (state: GlobalStore) => state.settings;
export const selectPerformanceMetrics = (state: GlobalStore) => state.performance.metrics;
export const selectSecurityStatus = (state: GlobalStore) => state.security.isSecure;
export const selectFeatureFlags = (state: GlobalStore) => state.features;
export const selectConnectivity = (state: GlobalStore) => state.connectivity;
export const selectDebugInfo = (state: GlobalStore) => state.debug;

// Hooks for specific functionality
export const useAppInitialization = () => useGlobalStore((state) => ({
  isInitialized: state.isInitialized,
  initialize: state.initialize,
  setInitialized: state.setInitialized,
}));

export const usePerformanceMonitoring = () => useGlobalStore((state) => ({
  metrics: state.performance.metrics,
  isMonitoring: state.performance.isMonitoring,
  alerts: state.performance.alerts,
  addMetric: state.addPerformanceMetric,
  toggleMonitoring: state.togglePerformanceMonitoring,
  addAlert: state.addPerformanceAlert,
  resolveAlert: state.resolvePerformanceAlert,
  clearData: state.clearPerformanceData,
}));

export const useSecurityMonitoring = () => useGlobalStore((state) => ({
  events: state.security.events,
  isSecure: state.security.isSecure,
  lastCheck: state.security.lastSecurityCheck,
  addEvent: state.addSecurityEvent,
  updateStatus: state.updateSecurityStatus,
  performCheck: state.performSecurityCheck,
}));

export const useFeatureFlags = () => useGlobalStore((state) => ({
  features: state.features,
  setFlag: state.setFeatureFlag,
  toggleFlag: state.toggleFeatureFlag,
}));

export const useConnectivity = () => useGlobalStore((state) => ({
  connectivity: state.connectivity,
  setOnline: state.setOnlineStatus,
  updateApi: state.updateApiStatus,
  updateWs: state.updateWsStatus,
}));

export const useDebug = () => useGlobalStore((state) => ({
  debug: state.debug,
  toggle: state.toggleDebug,
  addLog: state.addDebugLog,
  addError: state.addErrorLog,
  clearLogs: state.clearDebugLogs,
}));
