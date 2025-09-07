// Initialize settings table with bKash configuration
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const dbConfig = {
  host: process.env.NEXT_PUBLIC_DB_HOST || 'localhost',
  user: process.env.NEXT_PUBLIC_DB_USER || 'root',
  password: process.env.NEXT_PUBLIC_DB_PASS || '',
  database: process.env.NEXT_PUBLIC_DB_NAME || 'bdmaps_db',
};

async function initializeSettings() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    // Read the SQL file
    const sqlFile = path.join(process.cwd(), 'src', 'scripts', 'createSettingsTable.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split SQL statements and execute them
    const statements = sqlContent.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.trim().substring(0, 50) + '...');
        await connection.execute(statement.trim());
      }
    }
    
    console.log('Settings table initialized successfully!');
    
    // Verify the data
    const [rows] = await connection.execute('SELECT * FROM settings');
    console.log('Current settings:');
    rows.forEach(row => {
      console.log(`- ${row.setting_key}: ${row.setting_value.substring(0, 20)}${row.setting_value.length > 20 ? '...' : ''}`);
    });
    
  } catch (error) {
    console.error('Error initializing settings:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run initialization
initializeSettings();
