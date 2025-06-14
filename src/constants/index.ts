// Application constants for Energent.ai

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// WebSocket Configuration
export const WS_CONFIG = {
  BASE_URL: import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:3000',
  RECONNECT_INTERVAL: 5000, // 5 seconds
  MAX_RECONNECT_ATTEMPTS: 10,
  HEARTBEAT_INTERVAL: 30000, // 30 seconds
} as const;

// VNC Configuration
export const VNC_CONFIG = {
  DEFAULT_PORT: 5900,
  DEFAULT_QUALITY: {
    compression: 6,
    jpegQuality: 6,
    colorDepth: 24,
    frameRate: 30,
  },
  DEFAULT_ENCODING: 'tight',
  MAX_RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 2000, // 2 seconds
  VIEWPORT: {
    MIN_SCALE: 0.1,
    MAX_SCALE: 3.0,
    DEFAULT_SCALE: 1.0,
  },
} as const;

// AI Agent Configuration
export const AI_CONFIG = {
  DEFAULT_MODEL: 'gpt-4',
  MAX_CONTEXT_LENGTH: 4096,
  DEFAULT_TEMPERATURE: 0.7,
  DEFAULT_TOP_P: 0.9,
  MAX_TOKENS: 2048,
  RESPONSE_TIMEOUT: 60000, // 60 seconds
  STREAMING_ENABLED: true,
} as const;

// Chat Configuration
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 4000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/plain',
    'application/pdf',
    'application/json',
  ],
  MESSAGE_BATCH_SIZE: 50,
  AUTO_SCROLL_THRESHOLD: 100,
} as const;

// UI Configuration
export const UI_CONFIG = {
  ANIMATION_DURATION: 200, // milliseconds
  TOAST_DURATION: 5000, // 5 seconds
  DEBOUNCE_DELAY: 300, // milliseconds
  THROTTLE_DELAY: 100, // milliseconds
  SIDEBAR_WIDTH: {
    COLLAPSED: 64,
    EXPANDED: 280,
  },
  MOBILE_BREAKPOINT: 768, // pixels
  TABLET_BREAKPOINT: 1024, // pixels
} as const;

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  BUNDLE_SIZE_LIMIT: 4 * 1024 * 1024, // 4MB
  JAVASCRIPT_LIMIT: 3 * 1024 * 1024, // 3MB
  VENDOR_LIMIT: 1.5 * 1024 * 1024, // 1.5MB
  WASM_LIMIT: 500 * 1024, // 500KB
  RENDER_BUDGET: 16, // milliseconds (60fps)
  MEMORY_THRESHOLD: 50 * 1024 * 1024, // 50MB
} as const;

// Security Configuration
export const SECURITY_CONFIG = {
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_TOKEN_THRESHOLD: 5 * 60 * 1000, // 5 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  CSRF_TOKEN_HEADER: 'X-CSRF-Token',
  CONTENT_SECURITY_POLICY: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'connect-src': ["'self'", 'wss:', 'https:'],
    'font-src': ["'self'", 'https:'],
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'energent_auth_token',
  REFRESH_TOKEN: 'energent_refresh_token',
  USER_PREFERENCES: 'energent_user_preferences',
  CHAT_HISTORY: 'energent_chat_history',
  VNC_SETTINGS: 'energent_vnc_settings',
  UI_STATE: 'energent_ui_state',
  PERFORMANCE_METRICS: 'energent_performance_metrics',
} as const;

// Event Names
export const EVENTS = {
  // Auth events
  AUTH_LOGIN: 'auth:login',
  AUTH_LOGOUT: 'auth:logout',
  AUTH_TOKEN_REFRESH: 'auth:token_refresh',
  
  // Chat events
  CHAT_MESSAGE_SEND: 'chat:message_send',
  CHAT_MESSAGE_RECEIVE: 'chat:message_receive',
  CHAT_SESSION_START: 'chat:session_start',
  CHAT_SESSION_END: 'chat:session_end',
  CHAT_TYPING_START: 'chat:typing_start',
  CHAT_TYPING_END: 'chat:typing_end',
  
  // VNC events
  VNC_CONNECT: 'vnc:connect',
  VNC_DISCONNECT: 'vnc:disconnect',
  VNC_FRAME_UPDATE: 'vnc:frame_update',
  VNC_ERROR: 'vnc:error',
  
  // AI events
  AI_REQUEST: 'ai:request',
  AI_RESPONSE: 'ai:response',
  AI_STREAM_START: 'ai:stream_start',
  AI_STREAM_CHUNK: 'ai:stream_chunk',
  AI_STREAM_END: 'ai:stream_end',
  AI_ERROR: 'ai:error',
  
  // UI events
  UI_THEME_CHANGE: 'ui:theme_change',
  UI_SIDEBAR_TOGGLE: 'ui:sidebar_toggle',
  UI_MODAL_OPEN: 'ui:modal_open',
  UI_MODAL_CLOSE: 'ui:modal_close',
  UI_TOAST_SHOW: 'ui:toast_show',
  UI_TOAST_HIDE: 'ui:toast_hide',
  
  // Performance events
  PERFORMANCE_METRIC: 'performance:metric',
  PERFORMANCE_WARNING: 'performance:warning',
  PERFORMANCE_ERROR: 'performance:error',
  
  // Security events
  SECURITY_VIOLATION: 'security:violation',
  SECURITY_WARNING: 'security:warning',
} as const;

// Error Codes
export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTION_LOST: 'CONNECTION_LOST',
  
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // VNC errors
  VNC_CONNECTION_FAILED: 'VNC_CONNECTION_FAILED',
  VNC_AUTH_FAILED: 'VNC_AUTH_FAILED',
  VNC_PROTOCOL_ERROR: 'VNC_PROTOCOL_ERROR',
  
  // AI errors
  AI_SERVICE_UNAVAILABLE: 'AI_SERVICE_UNAVAILABLE',
  AI_QUOTA_EXCEEDED: 'AI_QUOTA_EXCEEDED',
  AI_INVALID_REQUEST: 'AI_INVALID_REQUEST',
  AI_RESPONSE_ERROR: 'AI_RESPONSE_ERROR',
  
  // File errors
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  UNSUPPORTED_FILE_TYPE: 'UNSUPPORTED_FILE_TYPE',
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  
  // Generic errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_AI_STREAMING: true,
  ENABLE_VNC_COMPRESSION: true,
  ENABLE_PERFORMANCE_MONITORING: true,
  ENABLE_SECURITY_LOGGING: true,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_EXPERIMENTAL_FEATURES: false,
  ENABLE_DEBUG_MODE: import.meta.env.DEV,
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a',
    },
    GRAY: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    INFO: '#3b82f6',
  },
  SHADOWS: {
    SM: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    MD: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    LG: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    XL: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  BORDER_RADIUS: {
    SM: '0.125rem',
    DEFAULT: '0.25rem',
    MD: '0.375rem',
    LG: '0.5rem',
    XL: '0.75rem',
    FULL: '9999px',
  },
} as const;

// Monitoring Configuration
export const MONITORING_CONFIG = {
  PERFORMANCE_SAMPLING_RATE: 0.1, // 10% of sessions
  ERROR_SAMPLING_RATE: 1.0, // 100% of errors
  METRICS_BUFFER_SIZE: 100,
  METRICS_FLUSH_INTERVAL: 30000, // 30 seconds
  CORE_WEB_VITALS_THRESHOLD: {
    LCP: 2500, // milliseconds
    FID: 100, // milliseconds
    CLS: 0.1, // score
  },
} as const;

// Development Configuration
export const DEV_CONFIG = {
  ENABLE_REDUX_DEVTOOLS: import.meta.env.DEV,
  ENABLE_WHY_DID_YOU_RENDER: import.meta.env.DEV,
  MOCK_API_RESPONSES: import.meta.env.DEV,
  LOG_LEVEL: import.meta.env.DEV ? 'debug' : 'warn',
  HOT_RELOAD_ENABLED: import.meta.env.DEV,
} as const;
