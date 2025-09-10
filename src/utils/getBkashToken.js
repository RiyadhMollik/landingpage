import SettingsService from '@/services/settingsService';
import axios from 'axios';

async function getBkashConfig() {
  try {
    return await SettingsService.getBkashConfig();
  } catch (error) {
    console.error('Error getting bKash config from database:', error);
    // Fallback to environment variables
    return {
      baseURL: process.env.NEXT_PUBLIC_BKASH_BASE_URL,
      app_key: process.env.NEXT_PUBLIC_BKASH_APP_KEY,
      app_secret: process.env.NEXT_PUBLIC_BKASH_APP_SECRET,
      username: process.env.NEXT_PUBLIC_BKASH_USERNAME,
      password: process.env.NEXT_PUBLIC_BKASH_PASSWORD,
      base_url: process.env.NEXT_PUBLIC_BASE_URL
    };
  }
}

// Function to fetch a new bKash token
let accessToken = null;
let tokenExpiry = null; // timestamp

export  async function getAccessToken() {
  // refresh if token not set OR expired
  if (!accessToken || Date.now() >= tokenExpiry) {
    accessToken = await fetchNewToken();

    // set expiry 10 minutes from now
    tokenExpiry = Date.now() + (10 * 60 * 1000); 
  }

  return accessToken;
}

async function fetchNewToken() {
  const bkashConfig = await getBkashConfig();

  console.log('bKash callback config from database:', {
    baseURL: bkashConfig.baseURL,
    app_key: bkashConfig.app_key ? '***' : undefined,
    app_secret: bkashConfig.app_secret ? '***' : undefined,
    username: bkashConfig.username ? '***' : undefined,
    password: bkashConfig.password ? '***' : undefined
  });

  const response = await axios.post(`${bkashConfig.baseURL}/token/grant`, {
    app_key: bkashConfig.app_key,
    app_secret: bkashConfig.app_secret
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'username': bkashConfig.username,
      'password': bkashConfig.password
    }
  });

  console.log('bKash Token Response:', response.data);

  return response.data.id_token;
}