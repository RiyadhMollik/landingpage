#!/usr/bin/env node

// Production-ready initialization script for settings table
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Function to read environment variables with validation
function getEnvVar(name, fallbacks = [], defaultValue = null) {
  const value = process.env[name];
  if (value) return value;
  
  for (const fallback of fallbacks) {
    const fallbackValue = process.env[fallback];
    if (fallbackValue) return fallbackValue;
  }
  
  return defaultValue;
}

// Get database configuration from various possible environment variables
const dbConfig = {
  host: getEnvVar('DB_HOST', ['NEXT_PUBLIC_DB_HOST', 'DATABASE_HOST'], 'localhost'),
  user: getEnvVar('DB_USER', ['NEXT_PUBLIC_DB_USER', 'DATABASE_USER'], 'root'),
  password: getEnvVar('DB_PASS', ['NEXT_PUBLIC_DB_PASS', 'DATABASE_PASSWORD', 'DB_PASSWORD'], ''),
  database: getEnvVar('DB_NAME', ['NEXT_PUBLIC_DB_NAME', 'DATABASE_NAME'], 'bdmaps_db'),
  port: parseInt(getEnvVar('DB_PORT', ['NEXT_PUBLIC_DB_PORT', 'DATABASE_PORT'], '3306')),
  ssl: false,
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from(dbConfig.password + '\0')
  }
};

console.log('=== Database Settings Initialization ===');
console.log('Database configuration:');
console.log(`- Host: ${dbConfig.host}`);
console.log(`- Port: ${dbConfig.port}`);
console.log(`- User: ${dbConfig.user}`);
console.log(`- Database: ${dbConfig.database}`);
console.log(`- Password: ${dbConfig.password ? '[PROVIDED]' : '[NOT PROVIDED]'}`);
console.log('');

async function initializeSettings() {
  let connection;
  
  try {
    console.log('🔄 Connecting to MySQL database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful!');
    
    // Test connection
    await connection.execute('SELECT 1');
    
    // Read the SQL file
    const sqlFile = path.join(process.cwd(), 'src', 'scripts', 'createSettingsTable.sql');
    
    if (!fs.existsSync(sqlFile)) {
      throw new Error(`SQL file not found at: ${sqlFile}`);
    }
    
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    console.log('📖 SQL file loaded successfully');
    
    // Split SQL statements and execute them
    const statements = sqlContent.split(';').filter(stmt => stmt.trim());
    
    console.log(`🔄 Executing ${statements.length} SQL statements...`);
    
    for (const statement of statements) {
      if (statement.trim()) {
        const preview = statement.trim().substring(0, 50).replace(/\s+/g, ' ');
        console.log(`  - Executing: ${preview}...`);
        await connection.execute(statement.trim());
      }
    }
    
    console.log('✅ Settings table structure created/updated successfully!');
    
    // Verify the data
    const [rows] = await connection.execute('SELECT setting_key, setting_value, created_at FROM settings ORDER BY setting_key');
    
    if (rows.length > 0) {
      console.log('\n📋 Current settings in database:');
      rows.forEach(row => {
        const value = row.setting_value ? 
          (row.setting_value.length > 30 ? row.setting_value.substring(0, 30) + '...' : row.setting_value) : 
          '[empty]';
        console.log(`  - ${row.setting_key}: ${value}`);
      });
    } else {
      console.log('\n📋 Settings table is empty - ready for configuration via admin panel');
    }
    
    console.log('\n🎉 Initialization completed successfully!');
    console.log('💡 You can now configure bKash settings through your admin panel');
    
  } catch (error) {
    console.error('\n❌ Error initializing settings:');
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🔐 Access denied - Please check your database credentials');
      console.error('📝 Make sure to set the following environment variables:');
      console.error('   - DB_HOST (or NEXT_PUBLIC_DB_HOST)');
      console.error('   - DB_USER (or NEXT_PUBLIC_DB_USER)');
      console.error('   - DB_PASS (or NEXT_PUBLIC_DB_PASS)');
      console.error('   - DB_NAME (or NEXT_PUBLIC_DB_NAME)');
    } else if (error.code === 'ENOTFOUND') {
      console.error('🌐 Database host not found - Please check your DB_HOST setting');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('🗃️ Database does not exist - Please create the database first');
    } else {
      console.error('Error details:', error);
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔒 Database connection closed');
    }
  }
}

// Run initialization
initializeSettings();
