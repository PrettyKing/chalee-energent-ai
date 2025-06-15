import React, { useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Button, Input, Card, CardHeader, CardContent, CardFooter } from '../ui';
import { useGlobalStore, usePerformanceMonitoring } from '../../store';
import { showSuccessToastAtom, showErrorToastAtom, themeAtom } from '../../store/atoms';
import { useDebounce, useLocalStorage, useMediaQuery } from '../../hooks';

const Dashboard: React.FC = () => {
  // State management examples
  const [theme, setTheme] = useAtom(themeAtom);
  const [, showSuccessToast] = useAtom(showSuccessToastAtom);
  const [, showErrorToast] = useAtom(showErrorToastAtom);
  
  // Global store example
  const { isInitialized, initialize } = useGlobalStore((state) => ({
    isInitialized: state.isInitialized,
    initialize: state.initialize,
  }));
  
  const { addMetric, metrics } = usePerformanceMonitoring();
  
  // Local component state
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useLocalStorage('dashboard-prefs', {
    autoRefresh: true,
    notifications: true,
  });
  
  // Custom hooks examples
  const debouncedInput = useDebounce(inputValue, 300);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const handleInitialize = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      initialize();
      showSuccessToast('Application initialized successfully!');
      
      // Add performance metric
      addMetric({
        renderTime: Math.random() * 50,
        bundleSize: 3.2 * 1024 * 1024, // 3.2MB
        memoryUsage: Math.random() * 100 * 1024 * 1024, // Random memory usage
        networkLatency: Math.random() * 200,
        vncFrameRate: 30,
        aiResponseTime: Math.random() * 2000,
        errorRate: 0,
        timestamp: new Date(),
      });
    } catch (error) {
      showErrorToast('Failed to initialize application');
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeToggle = () => {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const handlePreferenceToggle = (key: keyof typeof userPreferences) => {
    setUserPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Energent.ai Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Frontend optimization showcase with modern state management
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size={isMobile ? 'sm' : 'md'}
              onClick={handleThemeToggle}
            >
              Theme: {theme}
            </Button>
            
            <Button
              variant="primary"
              size={isMobile ? 'sm' : 'md'}
              onClick={handleInitialize}
              isLoading={isLoading}
              disabled={isInitialized}
            >
              {isInitialized ? 'Initialized' : 'Initialize App'}
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="default" hover>
            <CardHeader
              title="Application Status"
              subtitle={isInitialized ? 'Ready' : 'Not initialized'}
            />
            <CardContent>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  isInitialized 
                    ? 'bg-green-500 animate-pulse' 
                    : 'bg-gray-400'
                }`} />
                <span className="text-sm">
                  {isInitialized ? 'System operational' : 'Waiting for initialization'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader
              title="Performance Metrics"
              subtitle={`${metrics.length} data points`}
            />
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Bundle Size:</span>
                  <span className="font-medium">3.2 MB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Memory Usage:</span>
                  <span className="font-medium">
                    {metrics.length > 0 
                      ? `${(metrics[metrics.length - 1].memoryUsage / (1024 * 1024)).toFixed(1)} MB`
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Response Time:</span>
                  <span className="font-medium">
                    {metrics.length > 0 
                      ? `${metrics[metrics.length - 1].renderTime.toFixed(1)}ms`
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="filled">
            <CardHeader
              title="User Preferences"
              subtitle="Stored locally"
            />
            <CardContent>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={userPreferences.autoRefresh}
                    onChange={() => handlePreferenceToggle('autoRefresh')}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm">Auto refresh</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={userPreferences.notifications}
                    onChange={() => handlePreferenceToggle('notifications')}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm">Enable notifications</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Demo */}
        <Card variant="outlined" size="lg">
          <CardHeader
            title="Interactive Demo"
            subtitle="Test state management and custom hooks"
            action={
              <div className="text-xs text-gray-500">
                Device: {isMobile ? 'Mobile' : 'Desktop'}
              </div>
            }
          />
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Test Input (Debounced)"
                  placeholder="Type something..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  helperText={`Debounced value: "${debouncedInput}"`}
                />
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => showSuccessToast('Success toast triggered!')}
                  >
                    Success Toast
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => showErrorToast('Error toast triggered!')}
                  >
                    Error Toast
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setInputValue('')}
                  >
                    Clear Input
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium mb-2">State Management Demo</h4>
                  <div className="text-sm space-y-1">
                    <div>Current theme: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{theme}</code></div>
                    <div>Input length: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{inputValue.length}</code></div>
                    <div>Debounced length: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{debouncedInput.length}</code></div>
                    <div>Metrics count: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{metrics.length}</code></div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium mb-2 text-blue-900 dark:text-blue-100">
                    Hooks in Action
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>✓ useAtom (Jotai state management)</li>
                    <li>✓ useDebounce (input debouncing)</li>
                    <li>✓ useLocalStorage (persistent preferences)</li>
                    <li>✓ useMediaQuery (responsive detection)</li>
                    <li>✓ useGlobalStore (Zustand global state)</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between items-center w-full">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This demo showcases the optimized frontend architecture
              </p>
              <Button variant="ghost" size="sm">
                Learn More
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'State Management',
              description: 'Jotai + Zustand + Immer',
              icon: '🎯',
              status: 'Active',
            },
            {
              title: 'Security',
              description: 'Multi-layer protection',
              icon: '🔒',
              status: 'Secure',
            },
            {
              title: 'Performance',
              description: 'Optimized rendering',
              icon: '⚡',
              status: 'Optimized',
            },
            {
              title: 'Mobile Ready',
              description: 'Responsive design',
              icon: '📱',
              status: 'Ready',
            },
          ].map((feature, index) => (
            <Card key={index} variant="default" hover clickable>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-2xl">{feature.icon}</div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    {feature.status}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
