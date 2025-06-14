import React from 'react';
import { Provider } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Energent.ai
                    </h1>
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">
                      Optimization Preview
                    </span>
                  </div>
                  <nav className="flex space-x-4">
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium">
                      Chat
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium">
                      VNC
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium">
                      Agents
                    </button>
                  </nav>
                </div>
              </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Welcome Section */}
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Welcome to Energent.ai Optimization Preview
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      This is a preview of the optimized frontend architecture featuring modern state management, 
                      enhanced security, and improved performance.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          State Management
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Jotai + Zustand + Immer for optimal performance
                        </p>
                      </div>
                      
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                          Security Enhanced
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Multi-layer security monitoring & dependency management
                        </p>
                      </div>
                      
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                          Performance Optimized
                        </h3>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          Bundle size control & rendering optimization
                        </p>
                      </div>
                      
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                          Mobile Ready
                        </h3>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          Responsive design with touch optimization
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Start Chat Session
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Connect VNC
                      </button>
                      <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        View Documentation
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Panel */}
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      System Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Frontend</span>
                        <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Online
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">API</span>
                        <span className="flex items-center text-sm text-yellow-600 dark:text-yellow-400">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                          Connecting
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Security</span>
                        <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Protected
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Performance Metrics
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Bundle Size</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">3.2MB</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Load Time</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">1.2s</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Memory Usage</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">45MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
