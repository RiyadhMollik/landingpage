// System testing script
require('dotenv').config();
const { execSync } = require('child_process');
const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const BASE_URL = 'http://localhost:3000';
let server;

async function startServer() {
  console.log('Starting Next.js development server...');
  server = require('child_process').spawn('npm', ['run', 'dev'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
  });

  // Wait for server to start
  return new Promise((resolve) => {
    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      if (output.includes('ready') && output.includes('started')) {
        console.log('Server started successfully!');
        resolve();
      }
    });

    server.stderr.on('data', (data) => {
      console.error(`Server error: ${data}`);
    });
  });
}

async function testHomePage() {
  try {
    console.log('\nTesting home page...');
    const response = await axios.get(BASE_URL);
    console.log('✅ Home page loaded successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to load home page:', error.message);
    return false;
  }
}

async function testProductAPI() {
  try {
    console.log('\nTesting product API...');
    const response = await axios.get(`${BASE_URL}/api/products`);
    if (response.data && Array.isArray(response.data) && response.data.length === 1) {
      console.log(`✅ Product API returned the single product: ${response.data[0].name}`);
      return true;
    } else if (response.data && Array.isArray(response.data) && response.data.length !== 1) {
      console.error(`❌ Product API returned ${response.data.length} products instead of 1`);
      return false;
    } else {
      console.error('❌ Product API did not return an array or returned an empty array');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to fetch products:', error.message);
    return false;
  }
}

async function testAdminLogin() {
  try {
    console.log('\nTesting admin login...');
    const response = await axios.post(`${BASE_URL}/api/auth`, {
      username: 'admin',
      password: 'admin123'
    });
    
    if (response.data && response.data.token) {
      console.log('✅ Admin login successful');
      return response.data.token;
    } else {
      console.error('❌ Admin login failed: No token received');
      return null;
    }
  } catch (error) {
    console.error('❌ Admin login failed:', error.message);
    return null;
  }
}

async function testOrdersAPI(token) {
  if (!token) return false;
  
  try {
    console.log('\nTesting orders API...');
    const response = await axios.get(`${BASE_URL}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.data && Array.isArray(response.data)) {
      console.log(`✅ Orders API returned ${response.data.length} orders`);
      return true;
    } else {
      console.error('❌ Orders API did not return an array');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to fetch orders:', error.message);
    return false;
  }
}

async function runTests() {
  try {
    await startServer();
    
    // Wait for server to be fully ready
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const homePageResult = await testHomePage();
    const productAPIResult = await testProductAPI();
    const adminToken = await testAdminLogin();
    const ordersAPIResult = await testOrdersAPI(adminToken);
    
    console.log('\n--- Test Results ---');
    console.log(`Home Page: ${homePageResult ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Product API: ${productAPIResult ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Admin Login: ${adminToken ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Orders API: ${ordersAPIResult ? '✅ PASS' : '❌ FAIL'}`);
    
    const allPassed = homePageResult && productAPIResult && adminToken && ordersAPIResult;
    console.log(`\nOverall Test Result: ${allPassed ? '✅ PASSED' : '❌ FAILED'}`);
    
    console.log('\nManual Testing Steps:');
    console.log('1. Visit http://localhost:3000 and click "Download Now"');
    console.log('2. Fill out the purchase form and submit');
    console.log('3. Test EPS payment flow (in sandbox mode)');
    console.log('4. Check admin dashboard at http://localhost:3000/admin/login');
    
    rl.question('\nPress Enter to stop the server and exit...', () => {
      if (server) {
        server.kill();
        console.log('Server stopped.');
      }
      rl.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Test error:', error);
    if (server) server.kill();
    process.exit(1);
  }
}

runTests();