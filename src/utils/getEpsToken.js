// EPS Payment Gateway Token Management
import axios from 'axios';
import crypto from 'crypto';
import { redisGet, redisSet } from './redisTokenManager.js';
import SettingsService from '../services/settingsService.js';

/**
 * Generate x-hash for EPS API authentication
 * @param {string} data - Data to hash (username or merchantTransactionId)
 * @param {string} hashKey - EPS hash key
 * @returns {string} Base64 encoded HMAC-SHA512 hash
 */
export function generateEpsHash(data, hashKey) {
  return crypto
    .createHmac('sha512', hashKey)
    .update(data)
    .digest('base64');
}

/**
 * Get EPS authentication token with caching
 * @returns {Promise<string>} EPS Bearer token
 */
export async function getEpsToken() {
  try {
    // Check for cached token
    const cachedToken = await redisGet('eps_token');
    if (cachedToken) {
      console.log('Using cached EPS token');
      return cachedToken;
    }

    // Get EPS configuration from database
    const epsConfig = await SettingsService.getEpsConfig();
    
    if (!epsConfig.username || !epsConfig.password || !epsConfig.hash_key) {
      throw new Error('EPS configuration incomplete. Please configure EPS settings in admin panel.');
    }

    // Generate x-hash using username
    const xHash = generateEpsHash(epsConfig.username, epsConfig.hash_key);

    console.log('Requesting new EPS token...');
    
    const response = await axios.post(
      `${epsConfig.base_url}/Auth/GetToken`,
      {
        userName: epsConfig.username,
        password: epsConfig.password,
      },
      {
        headers: {
          'x-hash': xHash,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    const { token, expireDate, errorMessage, errorCode } = response.data;

    if (errorCode || errorMessage) {
      throw new Error(`EPS Token Error: ${errorMessage || 'Unknown error'} (Code: ${errorCode})`);
    }

    if (!token) {
      throw new Error('No token received from EPS API');
    }

    // Calculate expiry time (expire 5 minutes before actual expiry)
    const expiryDate = new Date(expireDate);
    const bufferTime = 5 * 60 * 1000; // 5 minutes in ms
    const cacheExpiryTime = Math.max(300, Math.floor((expiryDate.getTime() - Date.now() - bufferTime) / 1000));

    // Cache the token
    await redisSet('eps_token', token, cacheExpiryTime);
    
    console.log(`✅ EPS token obtained and cached for ${cacheExpiryTime} seconds`);
    console.log(`Token expires at: ${expireDate}`);
    
    return token;

  } catch (error) {
    console.error('❌ EPS token error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('EPS Authentication failed. Please check username and password.');
    }
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      throw new Error('Cannot connect to EPS API. Please check network connection.');
    }
    
    throw error;
  }
}

/**
 * Clear cached EPS token (useful for testing or when token becomes invalid)
 */
export async function clearEpsToken() {
  try {
    await redisSet('eps_token', '', 0); // Set empty value with 0 expiry to delete
    console.log('EPS token cache cleared');
  } catch (error) {
    console.warn('Warning: Could not clear EPS token cache:', error.message);
  }
}