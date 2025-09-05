import React from 'react';
import useHealthCheck from '../hooks/useHealthCheck';
import SystemUnavailable from './SystemUnavailable';

interface AppHealthWrapperProps {
  children: React.ReactNode;
}

const AppHealthWrapper: React.FC<AppHealthWrapperProps> = ({ children }) => {
  const { isHealthy, isLoading, error, retry } = useHealthCheck(true);

  // Show loading state while checking health
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading system...</p>
        </div>
      </div>
    );
  }

  // Show error page if health check failed
  if (!isHealthy) {
    return (
      <SystemUnavailable
        onRetry={retry}
        isRetrying={isLoading}
        error={error}
      />
    );
  }

  // System is healthy, render the main app
  return <>{children}</>;
};

export default AppHealthWrapper;