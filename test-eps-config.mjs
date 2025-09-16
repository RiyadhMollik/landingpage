import dotenv from 'dotenv';
import SettingsService from './src/services/settingsService.js';

dotenv.config();

async function testEpsConfig() {
  try {
    console.log('🔍 Testing EPS configuration retrieval...\n');
    
    // Test database connection and settings retrieval
    const allSettings = await SettingsService.getAllSettings();
    console.log('📊 All EPS-related settings from database:');
    Object.keys(allSettings)
      .filter(key => key.startsWith('eps_'))
      .forEach(key => {
        const value = allSettings[key];
        console.log(`  - ${key}: ${value.length > 50 ? value.substring(0, 50) + '...' : value}`);
      });
    
    console.log('\n🔧 EPS Config from SettingsService:');
    const epsConfig = await SettingsService.getEpsConfig();
    Object.entries(epsConfig).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value && value.length > 50 ? value.substring(0, 50) + '...' : value}`);
    });
    
    // Check if merchant_id and store_id are properly set
    console.log('\n✅ Configuration Status:');
    console.log(`  - Merchant ID present: ${!!epsConfig.merchant_id}`);
    console.log(`  - Store ID present: ${!!epsConfig.store_id}`);
    console.log(`  - Hash Key present: ${!!epsConfig.hash_key}`);
    console.log(`  - Base URL present: ${!!epsConfig.base_url}`);
    
    if (!epsConfig.merchant_id || !epsConfig.store_id) {
      console.log('\n❌ Missing required configuration!');
      console.log('Merchant ID:', epsConfig.merchant_id);
      console.log('Store ID:', epsConfig.store_id);
    } else {
      console.log('\n✅ All required EPS configuration is present!');
    }
    
  } catch (error) {
    console.error('❌ Error testing EPS config:', error.message);
    console.error(error.stack);
  }
}

testEpsConfig();