import React, { useEffect } from 'react';
import { Provider } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/pages/Dashboard';
import { useGlobalStore } from './store';
import { useOnlineStatus } from './hooks';

// Initialize React Query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Main app content component
const AppContent: React.FC = () => {
  const isOnline = useOnlineStatus();
  const setOnlineStatus = useGlobalStore((state) => state.setOnlineStatus);

  useEffect(() => {
    setOnlineStatus(isOnline);
  }, [isOnline, setOnlineStatus]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Offline indicator */}
      {!isOnline && (
        <div className="bg-warning-500 text-white px-4 py-2 text-center text-sm">
          You are currently offline. Some features may not be available.
        </div>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<div className="p-8">Chat component coming soon...</div>} />
        <Route path="/vnc" element={<div className="p-8">VNC component coming soon...</div>} />
        <Route path="/agents" element={<div className="p-8">AI Agents component coming soon...</div>} />
        <Route path="*" element={<div className="p-8">404 - Page not found</div>} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
