interface HealthConfig {
  status: string;
  timestamp: string;
  version: string;
  features: {
    cms: boolean;
    translations: boolean;
    fileUploads: boolean;
    database: boolean;
  };
  appKey: string;
  environment: string;
}

interface HealthCheckResult {
  isHealthy: boolean;
  config?: HealthConfig;
  error?: string;
}

class HealthCheckService {
  private static instance: HealthCheckService;
  private baseUrl: string;
  private healthConfig: HealthConfig | null = null;
  private isInitialized = false;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  static getInstance(): HealthCheckService {
    if (!HealthCheckService.instance) {
      HealthCheckService.instance = new HealthCheckService();
    }
    return HealthCheckService.instance;
  }

  /**
   * Perform initial health check to get critical configuration
   */
  async performHealthCheck(): Promise<HealthCheckResult> {
    try {
      console.log('🔍 Performing health check...');
      
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }

      const config: HealthConfig = await response.json();
      
      // Validate that we received the critical app key
      if (!config.appKey || config.status !== 'healthy') {
        throw new Error('Invalid health response: missing appKey or unhealthy status');
      }

      this.healthConfig = config;
      this.isInitialized = true;
      
      console.log('✅ Health check passed:', config);
      
      return {
        isHealthy: true,
        config
      };

    } catch (error) {
      console.error('❌ Health check failed:', error);
      
      this.healthConfig = null;
      this.isInitialized = false;
      
      return {
        isHealthy: false,
        error: error instanceof Error ? error.message : 'Unknown health check error'
      };
    }
  }

  /**
   * Quick ping to check if backend is responsive
   */
  async ping(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ping`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      
      return response.ok;
    } catch (error) {
      console.error('Ping failed:', error);
      return false;
    }
  }

  /**
   * Get the stored health configuration
   */
  getHealthConfig(): HealthConfig | null {
    return this.healthConfig;
  }

  /**
   * Check if the system is properly initialized
   */
  isSystemHealthy(): boolean {
    return this.isInitialized && this.healthConfig !== null;
  }

  /**
   * Get the critical app key
   */
  getAppKey(): string | null {
    return this.healthConfig?.appKey || null;
  }

  /**
   * Check if a specific feature is available
   */
  isFeatureAvailable(feature: keyof HealthConfig['features']): boolean {
    return this.healthConfig?.features[feature] === true;
  }

  /**
   * Reset the health check state (useful for testing or manual retry)
   */
  reset(): void {
    this.healthConfig = null;
    this.isInitialized = false;
  }
}

export default HealthCheckService;
export type { HealthConfig, HealthCheckResult };