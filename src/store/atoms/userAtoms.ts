// User-related Jotai atoms for state management
import { atom } from 'jotai';
import { produce } from 'immer';
import type { User, UserPreferences } from '../../types';

// User state interface
interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  preferences: UserPreferences;
  sessions: UserSession[];
}

interface UserSession {
  id: string;
  userId: string;
  startTime: Date;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  notifications: {
    email: true,
    push: true,
    inApp: true,
    frequency: 'realtime',
  },
  ui: {
    sidebarCollapsed: false,
    compactMode: false,
    animationsEnabled: true,
  },
};

const initialUserState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  preferences: defaultPreferences,
  sessions: [],
};

// Base user atom
export const userAtom = atom(initialUserState);

// Derived atoms
export const currentUserAtom = atom(
  (get) => get(userAtom).currentUser
);

export const isAuthenticatedAtom = atom(
  (get) => get(userAtom).isAuthenticated
);

export const isLoadingAtom = atom(
  (get) => get(userAtom).isLoading
);

export const userErrorAtom = atom(
  (get) => get(userAtom).error
);

export const userPreferencesAtom = atom(
  (get) => get(userAtom).preferences,
  (get, set, preferences: Partial<UserPreferences>) => {
    set(userAtom, produce(get(userAtom), (draft) => {
      draft.preferences = { ...draft.preferences, ...preferences };
    }));
  }
);

export const userSessionsAtom = atom(
  (get) => get(userAtom).sessions
);

// Write-only atoms for actions
export const setCurrentUserAtom = atom(
  null,
  (get, set, user: User | null) => {
    set(userAtom, produce(get(userAtom), (draft) => {
      draft.currentUser = user;
      draft.isAuthenticated = !!user;
      draft.error = null;
      
      // Load user preferences if available
      if (user?.preferences) {
        draft.preferences = { ...draft.preferences, ...user.preferences };
      }
    }));
  }
);

export const setLoadingAtom = atom(
  null,
  (get, set, loading: boolean) => {
    set(userAtom, produce(get(userAtom), (draft) => {
      draft.isLoading = loading;
    }));
  }
);

export const setUserErrorAtom = atom(
  null,
  (get, set, error: string | null) => {
    set(userAtom, produce(get(userAtom), (draft) => {
      draft.error = error;
      draft.isLoading = false;
    }));
  }
);

export const updateUserProfileAtom = atom(
  null,
  (get, set, updates: Partial<User>) => {
    set(userAtom, produce(get(userAtom), (draft) => {
      if (draft.currentUser) {
        Object.assign(draft.currentUser, updates);
        draft.currentUser.updatedAt = new Date();
      }
    }));
  }
);

export const updateThemePreferenceAtom = atom(
  null,
  (get, set, theme: 'light' | 'dark' | 'system') => {
    set(userAtom, produce(get(userAtom), (draft) => {
      draft.preferences.theme = theme;
    }));
  }
);

export const updateNotificationPreferencesAtom = atom(
  null,
  (get, set, notifications: Partial<UserPreferences['notifications']>) => {
    set(userAtom, produce(get(userAtom), (draft) => {
      draft.preferences.notifications = {
        ...draft.preferences.notifications,
        ...notifications,
      };
    }));
  }
);

export const updateUIPreferencesAtom = atom(
  null,
  (get, set, ui: Partial<UserPreferences['ui']>) => {
    set(userAtom, produce(get(userAtom), (draft) => {
      draft.preferences.ui = {
        ...draft.preferences.ui,
        ...ui,
      };
    }));
  }
);

export const addUserSessionAtom = atom(
  null,
  (get, set, session: UserSession) => {
    set(userAtom, produce(get(userAtom), (draft) => {
      const existingIndex = draft.sessions.findIndex(s => s.id === session.id);
      if (existingIndex !== -1) {
        draft.sessions[existingIndex] = session;
      } else {
        draft.sessions.push(session);
      }
    }));
  }
);

export const updateSessionActivityAtom = atom(
  null,
  (get, set, sessionId: string) => {
    set(userAtom, produce(get(userAtom), (draft) => {
      const session = draft.sessions.find(s => s.id === sessionId);
      if (session) {
        session.lastActivity = new Date();
      }
    }));
  }
);

export const endUserSessionAtom = atom(
  null,
  (get, set, sessionId: string) => {
    set(userAtom, produce(get(userAtom), (draft) => {
      const session = draft.sessions.find(s => s.id === sessionId);
      if (session) {
        session.isActive = false;
      }
    }));
  }
);

export const logoutUserAtom = atom(
  null,
  (get, set) => {
    set(userAtom, produce(get(userAtom), (draft) => {
      draft.currentUser = null;
      draft.isAuthenticated = false;
      draft.error = null;
      draft.sessions = draft.sessions.map(session => ({
        ...session,
        isActive: false,
      }));
      // Keep preferences for better UX
    }));
  }
);

export const clearUserDataAtom = atom(
  null,
  (get, set) => {
    set(userAtom, {
      ...initialUserState,
      preferences: get(userAtom).preferences, // Preserve preferences
    });
  }
);

// Computed atoms
export const userInitialsAtom = atom(
  (get) => {
    const user = get(currentUserAtom);
    if (!user) return '';
    
    const names = user.name.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }
);

export const userRoleNamesAtom = atom(
  (get) => {
    const user = get(currentUserAtom);
    return user?.roles.map(role => role.name) || [];
  }
);

export const userPermissionsAtom = atom(
  (get) => {
    const user = get(currentUserAtom);
    if (!user) return [];
    
    const permissions = user.roles.flatMap(role => role.permissions);
    // Remove duplicates
    return permissions.filter((permission, index, self) => 
      index === self.findIndex(p => p.id === permission.id)
    );
  }
);

export const hasPermissionAtom = atom(
  (get) => (resource: string, action: string) => {
    const permissions = get(userPermissionsAtom);
    return permissions.some(
      permission => permission.resource === resource && permission.action === action
    );
  }
);

export const activeSessionsAtom = atom(
  (get) => {
    return get(userSessionsAtom).filter(session => session.isActive);
  }
);

export const currentSessionAtom = atom(
  (get) => {
    const sessions = get(activeSessionsAtom);
    // Return the most recent active session
    return sessions.reduce((latest, session) => {
      if (!latest || session.lastActivity > latest.lastActivity) {
        return session;
      }
      return latest;
    }, null as UserSession | null);
  }
);

export const sessionCountAtom = atom(
  (get) => get(activeSessionsAtom).length
);

export const isMultiSessionActiveAtom = atom(
  (get) => get(sessionCountAtom) > 1
);

// User status computed atoms
export const userDisplayNameAtom = atom(
  (get) => {
    const user = get(currentUserAtom);
    return user?.name || 'Anonymous User';
  }
);

export const userAvatarUrlAtom = atom(
  (get) => {
    const user = get(currentUserAtom);
    return user?.avatar || null;
  }
);

export const isUserAdminAtom = atom(
  (get) => {
    const roles = get(userRoleNamesAtom);
    return roles.includes('admin') || roles.includes('administrator');
  }
);

export const canAccessFeatureAtom = atom(
  (get) => (feature: string) => {
    const hasPermission = get(hasPermissionAtom);
    return hasPermission(feature, 'read') || hasPermission(feature, 'access');
  }
);

// Preferences helper atoms
export const isDarkModeAtom = atom(
  (get) => {
    const theme = get(userPreferencesAtom).theme;
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  }
);

export const notificationsEnabledAtom = atom(
  (get) => {
    const notifications = get(userPreferencesAtom).notifications;
    return notifications.email || notifications.push || notifications.inApp;
  }
);

export const compactModeAtom = atom(
  (get) => get(userPreferencesAtom).ui.compactMode
);

export const animationsEnabledAtom = atom(
  (get) => get(userPreferencesAtom).ui.animationsEnabled
);
