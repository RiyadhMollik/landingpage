// Test automatic Google Group management
import { grantGoogleDriveAccess, removeFromGoogleGroup, getGoogleGroupInfo } from './src/utils/googleDriveService.js';

async function testAutomaticGoogleGroup() {
  console.log('🧪 Testing automatic Google Group management...\n');
  
  try {
    // Test 1: Get Google Group info
    console.log('1️⃣ Testing Google Group info retrieval...');
    const groupInfo = await getGoogleGroupInfo();
    console.log('✅ Group info result:', JSON.stringify(groupInfo, null, 2));
    
    // Test 2: Automatically add customer to Google Group
    console.log('\n2️⃣ Testing automatic customer addition to Google Group...');
    const testEmail = 'mollikmdriyadh@gmail.com';
    const result = await grantGoogleDriveAccess(testEmail, 'মৌজা ম্যাপ ফাইল');
    
    console.log('✅ Automatic addition result:', JSON.stringify(result, null, 2));
    
    // Test 3: Try to remove customer (optional)
    // console.log('\n3️⃣ Testing customer removal from Google Group...');
    // const removeResult = await removeFromGoogleGroup(testEmail);
    // console.log('✅ Removal result:', JSON.stringify(removeResult, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('This is expected if Google Admin SDK is not properly configured yet.');
    console.error('Stack:', error.stack);
  }
}

testAutomaticGoogleGroup();