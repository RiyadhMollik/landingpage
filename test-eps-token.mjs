// Quick test to check if EPS token works now
import axios from 'axios';
import crypto from 'crypto';

const username = 'Epsdemo@gmail.com';
const password = 'Epsdemo258@';
const hashKey = 'FHZxyzeps56789gfhg678ygu876o=';

async function testEpsToken() {
  console.log('🧪 Testing EPS token generation...');
  
  const xHash = crypto
    .createHmac('sha512', hashKey)
    .update(username)
    .digest('base64');

  console.log('Generated x-hash:', xHash);

  try {
    const response = await axios.post(
      'https://sandboxpgapi.eps.com.bd/v1/Auth/GetToken',
      {
        userName: username,
        password: password,
      },
      {
        headers: {
          'x-hash': xHash,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ EPS Token Response:', response.data);
    
    if (response.data.token) {
      console.log('🎉 EPS token obtained successfully!');
      return true;
    } else {
      console.log('❌ No token in response');
      return false;
    }
  } catch (error) {
    console.error('❌ EPS Token Error:', error.response?.data || error.message);
    return false;
  }
}

testEpsToken();