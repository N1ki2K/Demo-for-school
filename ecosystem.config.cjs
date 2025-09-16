module.exports = {
  apps: [
    {
      name: 'school-cms-backend',
      script: './src/index.ts',
      interpreter: 'node',
      interpreter_args: '--loader ts-node/esm',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        HOST: '0.0.0.0',
        JWT_SECRET: 'your-super-secret-jwt-key-change-this-in-production',
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_NAME: 'school_cms',
        DB_USER: 'root',
        DB_PASSWORD: '',
        UPLOAD_PATH: './backend/uploads',
        APP_KEY: 'school-system-active',
        APP_VERSION: '1.0.0'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};