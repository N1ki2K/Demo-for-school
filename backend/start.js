const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up CMS Backend...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  fs.copyFileSync(path.join(__dirname, '.env.example'), envPath);
  console.log('✅ .env file created. Please review and update the settings.\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  exec('npm install', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error installing dependencies:', error);
      return;
    }
    console.log('✅ Dependencies installed.\n');
    startServer();
  });
} else {
  startServer();
}

function startServer() {
  console.log('🔥 Starting development server...\n');
  const server = exec('npm run dev');
  
  server.stdout.on('data', (data) => {
    console.log(data);
  });
  
  server.stderr.on('data', (data) => {
    console.error(data);
  });
  
  server.on('close', (code) => {
    console.log(`Server exited with code ${code}`);
  });
}