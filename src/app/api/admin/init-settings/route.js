// API endpoint to initialize settings table
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.NEXT_PUBLIC_DB_HOST || 'localhost',
  user: process.env.NEXT_PUBLIC_DB_USER || 'root',
  password: process.env.NEXT_PUBLIC_DB_PASS || '',
  database: process.env.NEXT_PUBLIC_DB_NAME || 'bdmaps_db',
};

export async function POST() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    // Create settings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS settings (
          id INT PRIMARY KEY AUTO_INCREMENT,
          setting_key VARCHAR(255) NOT NULL UNIQUE,
          setting_value TEXT NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Settings table created/verified');
    
    // Insert bKash configuration settings
    const settings = [
      ['bkash_app_key', '1KboS6ZLL5DH1oCt5dVc8hm5tc', 'bKash Application Key'],
      ['bkash_app_secret', '0yaPy0DeKpvrilI6s5HL1a3Qmf5Zt9ftNg6KZHS7Z92Z02fCd3nn', 'bKash Application Secret'],
      ['bkash_username', '01600056805', 'bKash API Username'],
      ['bkash_password', '8tZ!?>v&%:h', 'bKash API Password'],
      ['bkash_base_url', 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout', 'bKash API Base URL'],
      ['base_url', 'http://localhost:3000', 'Application Base URL']
    ];
    
    for (const [key, value, description] of settings) {
      await connection.execute(`
        INSERT INTO settings (setting_key, setting_value, description) VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          setting_value = VALUES(setting_value),
          description = VALUES(description),
          updated_at = CURRENT_TIMESTAMP
      `, [key, value, description]);
    }
    
    console.log('Settings initialized successfully!');
    
    // Verify the data
    const [rows] = await connection.execute('SELECT * FROM settings');
    console.log('Current settings count:', rows.length);
    
    return NextResponse.json({
      success: true,
      message: 'Settings initialized successfully!',
      settingsCount: rows.length
    });
    
  } catch (error) {
    console.error('Error initializing settings:', error);
    return NextResponse.json({
      success: false,
      message: 'Error initializing settings: ' + error.message
    }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
