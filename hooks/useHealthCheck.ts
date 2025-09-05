import { useState, useEffect } from 'react';
import HealthCheckService, { HealthCheckResult } from '../src/services/healthCheck';

interface UseHealthCheckReturn {
  isHealthy: boolean;
  isLoading: boolean;
  error: string | null;
  retry: () => Promise<void>;
  appKey: string | null;
}

export const useHealthCheck = (autoCheck: boolean = true): UseHealthCheckReturn => {
  const [isHealthy, setIsHealthy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const healthService = HealthCheckService.getInstance();

  const performCheck = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const result: HealthCheckResult = await healthService.performHealthCheck();
      
      setIsHealthy(result.isHealthy);
      
      if (!result.isHealthy) {
        setError(result.error || 'Unknown error occurred');
      }
    } catch (err) {
      console.error('Health check failed:', err);
      setIsHealthy(false);
      setError(err instanceof Error ? err.message : 'Health check failed');
    } finally {
      setIsLoading(false);
    }
  };

  const retry = async (): Promise<void> => {
    // Reset health service state
    healthService.reset();
    await performCheck();
  };

  useEffect(() => {
    if (autoCheck) {
      performCheck();
    }
  }, [autoCheck]);

  return {
    isHealthy,
    isLoading,
    error,
    retry,
    appKey: healthService.getAppKey()
  };
};

export default useHealthCheck;