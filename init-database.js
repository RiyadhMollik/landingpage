// Database initialization script
require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');

console.log('Starting database initialization...');

try {
  // Run the database initialization script
  console.log('Initializing database models and default data...');
  execSync('node src/scripts/initDb.js', { stdio: 'inherit' });
  
  console.log('\nDatabase initialization completed successfully!');
  console.log('\nYou can now:');
  console.log('1. Start the application with: npm run dev');
  console.log('2. Access the admin panel at: http://localhost:3000/admin/login');
  console.log('   Username: admin');
  console.log('   Password: admin123');
  console.log('3. Visit the homepage at: http://localhost:3000');
} catch (error) {
  console.error('\nError during database initialization:', error.message);
  console.error('Please check your .env file and database connection settings.');
  process.exit(1);
}