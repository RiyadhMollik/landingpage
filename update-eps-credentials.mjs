// Update EPS merchant credentials in database
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.NEXT_PUBLIC_DB_HOST || 'localhost',
  user: process.env.NEXT_PUBLIC_DB_USER || 'root', 
  password: process.env.NEXT_PUBLIC_DB_PASS || '',
  database: process.env.NEXT_PUBLIC_DB_NAME || 'bdmaps_db',
};

async function updateEpsCredentials() {
  try {
    console.log('🔧 Updating EPS merchant credentials...');
    const connection = await mysql.createConnection(dbConfig);
    
    // Update EPS merchant credentials with real values
    await connection.execute(
      'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
      ['29e86e70-0ac6-45eb-ba04-9fcb0aaed12a', 'eps_merchant_id']
    );
    
    await connection.execute(
      'UPDATE settings SET setting_value = ? WHERE setting_key = ?', 
      ['d44e705f-9e3a-41de-98b1-1674631637da', 'eps_store_id']
    );
    
    console.log('✅ EPS merchant credentials updated with real values');
    
    // Verify the update
    const [rows] = await connection.execute(
      'SELECT setting_key, setting_value FROM settings WHERE setting_key LIKE "eps_%"'
    );
    
    console.log('\n📋 Updated EPS settings:');
    rows.forEach(row => {
      const value = row.setting_value ? 
        (row.setting_value.length > 30 ? row.setting_value.substring(0, 30) + '...' : row.setting_value) : 
        '[EMPTY]';
      console.log(`  - ${row.setting_key}: ${value}`);
    });
    
    await connection.end();
    console.log('\n🎉 Database update completed!');
    
  } catch (error) {
    console.error('❌ Error updating EPS credentials:', error.message);
  }
}

updateEpsCredentials();