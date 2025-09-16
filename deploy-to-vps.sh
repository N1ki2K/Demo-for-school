#!/bin/bash

echo "🚀 School CMS VPS Deployment Script"
echo "=================================="

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server -y

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Setup MySQL
sudo mysql -e "CREATE DATABASE school_cms;"
sudo mysql -e "CREATE USER 'school_user'@'localhost' IDENTIFIED BY 'secure_password_123';"
sudo mysql -e "GRANT ALL PRIVILEGES ON school_cms.* TO 'school_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

echo "✅ Server setup complete!"
echo "📋 Next steps:"
echo "1. Upload your application files"
echo "2. Update .env with MySQL credentials:"
echo "   DB_USER=school_user"
echo "   DB_PASSWORD=secure_password_123"
echo "3. Run: npm install && npm run create-admin"
echo "4. Start: pm2 start backend/src/index.ts"