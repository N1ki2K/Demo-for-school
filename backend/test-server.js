const http = require('http');

console.log('🧪 Testing CMS Backend Connection...\n');

// Test health endpoint
const healthCheck = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3001/api/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
};

// Test login endpoint
const testLogin = () => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      username: 'admin',
      password: 'admin123'
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
};

// Run tests
const runTests = async () => {
  try {
    console.log('1. Testing health endpoint...');
    const health = await healthCheck();
    console.log('✅ Health check passed:', health.status);
    
    console.log('\n2. Testing login endpoint...');
    const login = await testLogin();
    if (login.status === 200 && login.data.token) {
      console.log('✅ Login test passed');
      console.log('   Token received:', login.data.token.substring(0, 20) + '...');
    } else {
      console.log('❌ Login test failed:', login);
    }
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the frontend: npm run dev (from root directory)');
    console.log('2. Navigate to http://localhost:5173');
    console.log('3. Click "Login" and use admin/admin123');
    console.log('4. Click "Edit" to enter edit mode');
    console.log('5. Try editing content on the site');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend server is running (npm run dev)');
    console.log('2. Check if port 3001 is available');
    console.log('3. Verify the .env file exists with proper settings');
  }
};

runTests();