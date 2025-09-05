import express from 'express';

const router = express.Router();

// Health check endpoint with critical app configuration
router.get('/health', (req, res) => {
  try {
    // Critical configuration that the frontend needs
    const criticalConfig = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || '1.0.0',
      features: {
        cms: true,
        translations: true,
        fileUploads: true,
        database: true
      },
      // Critical key that frontend must receive
      appKey: process.env.APP_KEY || 'school-system-active',
      environment: process.env.NODE_ENV || 'development'
    };

    res.json(criticalConfig);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Server error',
      timestamp: new Date().toISOString()
    });
  }
});

// Simple ping endpoint for basic connectivity
router.get('/ping', (req, res) => {
  res.json({ 
    message: 'pong', 
    timestamp: new Date().toISOString() 
  });
});

export default router;