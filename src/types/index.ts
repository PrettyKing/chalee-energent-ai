// Global TypeScript type definitions for the Energent.ai project

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAuthenticated: boolean;
  roles: UserRole[];
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationSettings;
  ui: UIPreferences;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  frequency: 'realtime' | 'daily' | 'weekly';
}

export interface UIPreferences {
  sidebarCollapsed: boolean;
  compactMode: boolean;
  animationsEnabled: boolean;
}

// Chat related types
export interface Message {
  id: string;
  content: string;
  type: MessageType;
  sender: MessageSender;
  timestamp: Date;
  metadata?: MessageMetadata;
  attachments?: Attachment[];
  reactions?: Reaction[];
}

export type MessageType = 
  | 'text' 
  | 'image' 
  | 'file' 
  | 'code' 
  | 'system' 
  | 'ai-response'
  | 'user-input';

export interface MessageSender {
  id: string;
  name: string;
  type: 'user' | 'ai' | 'system';
  avatar?: string;
}

export interface MessageMetadata {
  edited?: boolean;
  editedAt?: Date;
  readBy?: string[];
  deliveredAt?: Date;
  model?: string; // For AI responses
  confidence?: number; // For AI responses
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail?: string;
}

export interface Reaction {
  id: string;
  emoji: string;
  users: string[];
  count: number;
}

// Chat session types
export interface ChatSession {
  id: string;
  title: string;
  participants: Participant[];
  messages: Message[];
  status: ChatStatus;
  createdAt: Date;
  updatedAt: Date;
  metadata: ChatMetadata;
}

export interface Participant {
  id: string;
  user: User;
  role: 'admin' | 'member' | 'observer';
  joinedAt: Date;
  isActive: boolean;
}

export type ChatStatus = 'active' | 'archived' | 'ended' | 'paused';

export interface ChatMetadata {
  tags: string[];
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  isPrivate: boolean;
  aiModel?: string;
}

// VNC related types
export interface VNCSession {
  id: string;
  host: string;
  port: number;
  status: VNCStatus;
  quality: VNCQuality;
  encoding: VNCEncoding;
  connection: VNCConnection;
  viewport: VNCViewport;
  security: VNCSecurity;
  createdAt: Date;
  lastActiveAt: Date;
}

export type VNCStatus = 
  | 'connecting' 
  | 'connected' 
  | 'disconnected' 
  | 'error' 
  | 'reconnecting';

export interface VNCQuality {
  compression: number; // 0-9
  jpegQuality: number; // 0-9
  colorDepth: 8 | 16 | 24 | 32;
  frameRate: number;
}

export type VNCEncoding = 
  | 'raw' 
  | 'copyrect' 
  | 'rre' 
  | 'hextile' 
  | 'zlib' 
  | 'tight' 
  | 'ultra';

export interface VNCConnection {
  isSecure: boolean;
  latency: number;
  bandwidth: number;
  packetLoss: number;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
}

export interface VNCViewport {
  width: number;
  height: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  fullscreen: boolean;
}

export interface VNCSecurity {
  authType: 'none' | 'vnc' | 'vencrypt';
  encrypted: boolean;
  certificateVerified?: boolean;
}

// AI Agent types
export interface AIAgent {
  id: string;
  name: string;
  type: AgentType;
  model: AIModel;
  status: AgentStatus;
  capabilities: AgentCapability[];
  configuration: AgentConfiguration;
  performance: AgentPerformance;
  createdAt: Date;
  lastActiveAt: Date;
}

export type AgentType = 
  | 'conversational' 
  | 'task-oriented' 
  | 'analytical' 
  | 'creative' 
  | 'coding';

export interface AIModel {
  id: string;
  name: string;
  version: string;
  provider: 'openai' | 'anthropic' | 'google' | 'local';
  contextWindow: number;
  maxTokens: number;
  temperature: number;
  topP: number;
}

export type AgentStatus = 
  | 'idle' 
  | 'processing' 
  | 'responding' 
  | 'error' 
  | 'maintenance';

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  parameters?: Record<string, any>;
}

export interface AgentConfiguration {
  systemPrompt: string;
  responseStyle: 'concise' | 'detailed' | 'creative' | 'technical';
  personality: string;
  tools: AgentTool[];
  constraints: AgentConstraint[];
}

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  configuration?: Record<string, any>;
}

export interface AgentConstraint {
  type: 'time' | 'tokens' | 'content' | 'safety';
  value: any;
  description: string;
}

export interface AgentPerformance {
  averageResponseTime: number;
  successRate: number;
  userSatisfaction: number;
  totalInteractions: number;
  errorCount: number;
  lastEvaluatedAt: Date;
}

// Application state types
export interface AppState {
  user: User | null;
  currentSession: ChatSession | null;
  vncSessions: VNCSession[];
  agents: AIAgent[];
  ui: UIState;
  settings: AppSettings;
  notifications: Notification[];
}

export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  loading: boolean;
  errors: AppError[];
  modals: ModalState[];
  toasts: Toast[];
}

export interface AppSettings {
  autoSave: boolean;
  saveInterval: number;
  defaultAgent: string;
  defaultVNCQuality: VNCQuality;
  analytics: boolean;
  crashReporting: boolean;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

export interface AppError {
  id: string;
  type: 'network' | 'validation' | 'server' | 'client' | 'vnc' | 'ai';
  message: string;
  details?: string;
  timestamp: Date;
  resolved: boolean;
  stack?: string;
}

export interface ModalState {
  id: string;
  type: string;
  isOpen: boolean;
  data?: any;
}

export interface Toast {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// API response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: Date;
    requestId: string;
    version: string;
  };
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Event types
export interface AppEvent {
  type: string;
  payload: any;
  timestamp: Date;
  source: 'user' | 'system' | 'ai' | 'vnc';
}

export interface UserEvent extends AppEvent {
  userId: string;
  sessionId: string;
}

export interface SystemEvent extends AppEvent {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'security' | 'performance' | 'error' | 'info';
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type APIEndpoint = 
  | '/api/auth/login'
  | '/api/auth/logout'
  | '/api/auth/refresh'
  | '/api/users/profile'
  | '/api/chat/sessions'
  | '/api/chat/messages'
  | '/api/vnc/connect'
  | '/api/vnc/disconnect'
  | '/api/agents/list'
  | '/api/agents/interact';

// Performance monitoring types
export interface PerformanceMetrics {
  renderTime: number;
  bundleSize: number;
  memoryUsage: number;
  networkLatency: number;
  vncFrameRate: number;
  aiResponseTime: number;
  errorRate: number;
  timestamp: Date;
}

export interface SecurityEvent {
  id: string;
  type: 'authentication' | 'authorization' | 'vulnerability' | 'intrusion';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  source: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  resolved: boolean;
}
