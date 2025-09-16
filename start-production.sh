#!/bin/bash

echo "🚀 Starting School CMS in Production Mode..."

# Create logs directory if it doesn't exist
mkdir -p logs

# Create uploads directory if it doesn't exist
mkdir -p backend/uploads

# Build frontend if needed
if [ ! -d "dist" ]; then
  echo "📦 Building frontend..."
  npm run build
fi

# Start backend with PM2
echo "🔧 Starting backend..."
cd backend
npx pm2 start ../ecosystem.config.cjs

# Show status
npx pm2 status

echo "✅ School CMS is now running!"
echo "🌐 Frontend: Serve the 'dist' folder with your preferred web server"
echo "🔗 Backend API: http://localhost:3001"
echo "📊 PM2 Monitoring: npx pm2 monit"
echo "🛑 To stop: npx pm2 stop school-cms-backend"