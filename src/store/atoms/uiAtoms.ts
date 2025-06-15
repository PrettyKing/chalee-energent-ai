// UI state-related Jotai atoms for state management
import { atom } from 'jotai';
import { produce } from 'immer';
import type { Toast, ModalState, AppError, Notification } from '../../types';

// UI state interface
interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  loading: boolean;
  errors: AppError[];
  modals: ModalState[];
  toasts: Toast[];
  notifications: Notification[];
  pageTitle: string;
  breadcrumbs: BreadcrumbItem[];
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

const initialUIState: UIState = {
  theme: 'system',
  sidebarOpen: true,
  sidebarCollapsed: false,
  loading: false,
  errors: [],
  modals: [],
  toasts: [],
  notifications: [],
  pageTitle: 'Energent.ai',
  breadcrumbs: [],
};

// Base UI atom
export const uiAtom = atom(initialUIState);

// Derived atoms
export const themeAtom = atom(
  (get) => get(uiAtom).theme,
  (get, set, theme: 'light' | 'dark' | 'system') => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      draft.theme = theme;
    }));
    
    // Apply theme to document
    const root = document.documentElement;
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }
);

export const sidebarOpenAtom = atom(
  (get) => get(uiAtom).sidebarOpen,
  (get, set, open: boolean) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      draft.sidebarOpen = open;
    }));
  }
);

export const sidebarCollapsedAtom = atom(
  (get) => get(uiAtom).sidebarCollapsed,
  (get, set, collapsed: boolean) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      draft.sidebarCollapsed = collapsed;
    }));
  }
);

export const loadingAtom = atom(
  (get) => get(uiAtom).loading,
  (get, set, loading: boolean) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      draft.loading = loading;
    }));
  }
);

export const errorsAtom = atom(
  (get) => get(uiAtom).errors
);

export const modalsAtom = atom(
  (get) => get(uiAtom).modals
);

export const toastsAtom = atom(
  (get) => get(uiAtom).toasts
);

export const notificationsAtom = atom(
  (get) => get(uiAtom).notifications
);

export const pageTitleAtom = atom(
  (get) => get(uiAtom).pageTitle,
  (get, set, title: string) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      draft.pageTitle = title;
    }));
    document.title = title;
  }
);

export const breadcrumbsAtom = atom(
  (get) => get(uiAtom).breadcrumbs,
  (get, set, breadcrumbs: BreadcrumbItem[]) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      draft.breadcrumbs = breadcrumbs;
    }));
  }
);

// Write-only atoms for actions
export const toggleSidebarAtom = atom(
  null,
  (get, set) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      draft.sidebarOpen = !draft.sidebarOpen;
    }));
  }
);

export const addErrorAtom = atom(
  null,
  (get, set, error: Omit<AppError, 'id' | 'timestamp'>) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      const newError: AppError = {
        ...error,
        id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        resolved: false,
      };
      draft.errors.unshift(newError);
      
      // Keep only last 10 errors
      if (draft.errors.length > 10) {
        draft.errors = draft.errors.slice(0, 10);
      }
    }));
  }
);

export const removeErrorAtom = atom(
  null,
  (get, set, errorId: string) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      draft.errors = draft.errors.filter(error => error.id !== errorId);
    }));
  }
);

export const resolveErrorAtom = atom(
  null,
  (get, set, errorId: string) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      const error = draft.errors.find(e => e.id === errorId);
      if (error) {
        error.resolved = true;
      }
    }));
  }
);

export const openModalAtom = atom(
  null,
  (get, set, modal: Omit<ModalState, 'id'>) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      const newModal: ModalState = {
        ...modal,
        id: `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        isOpen: true,
      };
      draft.modals.push(newModal);
    }));
  }
);

export const closeModalAtom = atom(
  null,
  (get, set, modalId: string) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      const modal = draft.modals.find(m => m.id === modalId);
      if (modal) {
        modal.isOpen = false;
      }
    }));
  }
);

export const removeModalAtom = atom(
  null,
  (get, set, modalId: string) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      draft.modals = draft.modals.filter(modal => modal.id !== modalId);
    }));
  }
);

export const showToastAtom = atom(
  null,
  (get, set, toast: Omit<Toast, 'id'>) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      const newToast: Toast = {
        ...toast,
        id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        duration: toast.duration || 5000,
      };
      draft.toasts.push(newToast);
      
      // Auto-remove toast after duration
      setTimeout(() => {
        set(removeToastAtom, newToast.id);
      }, newToast.duration);
    }));
  }
);

export const removeToastAtom = atom(
  null,
  (get, set, toastId: string) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      draft.toasts = draft.toasts.filter(toast => toast.id !== toastId);
    }));
  }
);

export const addNotificationAtom = atom(
  null,
  (get, set, notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      const newNotification: Notification = {
        ...notification,
        id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        read: false,
      };
      draft.notifications.unshift(newNotification);
      
      // Keep only last 50 notifications
      if (draft.notifications.length > 50) {
        draft.notifications = draft.notifications.slice(0, 50);
      }
    }));
  }
);

export const markNotificationReadAtom = atom(
  null,
  (get, set, notificationId: string) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      const notification = draft.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    }));
  }
);

export const markAllNotificationsReadAtom = atom(
  null,
  (get, set) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      draft.notifications.forEach(notification => {
        notification.read = true;
      });
    }));
  }
);

export const removeNotificationAtom = atom(
  null,
  (get, set, notificationId: string) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      draft.notifications = draft.notifications.filter(n => n.id !== notificationId);
    }));
  }
);

export const clearAllNotificationsAtom = atom(
  null,
  (get, set) => {
    set(uiAtom, produce(get(uiAtom), (draft) => {
      draft.notifications = [];
    }));
  }
);

// Computed atoms
export const unresolvedErrorsAtom = atom(
  (get) => get(uiAtom).errors.filter(error => !error.resolved)
);

export const openModalsAtom = atom(
  (get) => get(uiAtom).modals.filter(modal => modal.isOpen)
);

export const unreadNotificationsAtom = atom(
  (get) => get(uiAtom).notifications.filter(notification => !notification.read)
);

export const unreadNotificationCountAtom = atom(
  (get) => get(unreadNotificationsAtom).length
);

export const recentNotificationsAtom = atom(
  (get) => {
    const notifications = get(uiAtom).notifications;
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return notifications.filter(notification => notification.timestamp > oneDayAgo);
  }
);

export const hasActiveToastsAtom = atom(
  (get) => get(uiAtom).toasts.length > 0
);

export const currentBreadcrumbAtom = atom(
  (get) => {
    const breadcrumbs = get(uiAtom).breadcrumbs;
    return breadcrumbs.find(item => item.current) || breadcrumbs[breadcrumbs.length - 1];
  }
);

// Utility atoms for common UI patterns
export const showSuccessToastAtom = atom(
  null,
  (get, set, message: string) => {
    set(showToastAtom, {
      type: 'success',
      message,
    });
  }
);

export const showErrorToastAtom = atom(
  null,
  (get, set, message: string) => {
    set(showToastAtom, {
      type: 'error',
      message,
    });
  }
);

export const showWarningToastAtom = atom(
  null,
  (get, set, message: string) => {
    set(showToastAtom, {
      type: 'warning',
      message,
    });
  }
);

export const showInfoToastAtom = atom(
  null,
  (get, set, message: string) => {
    set(showToastAtom, {
      type: 'info',
      message,
    });
  }
);
