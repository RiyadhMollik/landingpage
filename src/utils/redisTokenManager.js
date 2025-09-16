import { createClient } from 'redis';

// Initialize Redis client
const redisClient = createClient({
  url: 'redis://default:okTSxSLzDQlBMxGWmSclTUEJLdHYjQRo@redis-10491.c81.us-east-1-2.ec2.redns.redis-cloud.com:10491'
});

// Track connection status
let isConnected = false;

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    isConnected = true;
    console.log('Connected to Redis successfully');
  } catch (err) {
    console.error('Redis connection error:', err);
    isConnected = false;
  }
})();

// Handle Redis errors
redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
  isConnected = false;
});

// Handle Redis reconnection
redisClient.on('connect', () => {
  isConnected = true;
  console.log('Redis client reconnected');
});

/**
 * Get token from Redis cache or fetch a new one using the provided fetch function
 * @param {string} tokenKey - The key to store/retrieve the token in Redis
 * @param {Function} fetchTokenFn - Async function to fetch a new token if not in cache
 * @param {number} expirationSeconds - Token expiration time in seconds
 * @returns {Promise<string>} - The token
 */
export async function getOrFetchToken(tokenKey, fetchTokenFn, expirationSeconds = 3600) {
  try {
    // If Redis is not connected, fetch a new token directly
    if (!isConnected) {
      console.log(`Redis not connected, fetching new ${tokenKey} directly`);
      return await fetchTokenFn();
    }

    // Check if token exists in Redis
    try {
      const cachedToken = await redisClient.get(tokenKey);

      if (cachedToken) {
        // If cachedToken is a string, parse it first
        const tokenObj = typeof cachedToken === "string" ? JSON.parse(cachedToken) : cachedToken;
        return tokenObj.token; // Return only the token
      }
    } catch (redisError) {
      console.error(`Redis error while getting ${tokenKey}:`, redisError);
      // Continue with fetching a new token
    }

    console.log(`No cached ${tokenKey} found, fetching new token`);

    // If no cached token, fetch a new one
    const token = await fetchTokenFn();

    // Try to store token in Redis with expiration
    try {
      if (isConnected) {
        await redisClient.set(tokenKey, token, { EX: expirationSeconds });
        console.log(`Stored new ${tokenKey} in Redis with ${expirationSeconds}s expiration`);
      }
    } catch (redisError) {
      console.error(`Redis error while storing ${tokenKey}:`, redisError);
      // Continue with returning the token even if storing fails
    }

    return token;
  } catch (error) {
    console.error(`Error in getOrFetchToken for ${tokenKey}:`, error);
    // In case of any error, try to fetch a new token directly as fallback
    try {
      console.log(`Attempting fallback direct token fetch for ${tokenKey}`);
      return await fetchTokenFn();
    } catch (fallbackError) {
      console.error(`Fallback fetch failed for ${tokenKey}:`, fallbackError);
      throw fallbackError; // Re-throw the fallback error
    }
  }
}

/**
 * Check if Redis is currently connected
 * @returns {boolean} - Connection status
 */
export function isRedisConnected() {
  return isConnected;
}

/**
 * Force refresh a token regardless of cache status
 * @param {string} tokenKey - The key to store/retrieve the token in Redis
 * @param {Function} fetchTokenFn - Async function to fetch a new token
 * @param {number} expirationSeconds - Token expiration time in seconds
 * @returns {Promise<string>} - The new token
 */
export async function forceRefreshToken(tokenKey, fetchTokenFn, expirationSeconds = 3600) {
  try {
    console.log(`Force refreshing ${tokenKey}`);
    const token = await fetchTokenFn();

    // Try to store in Redis if connected
    if (isConnected) {
      try {
        await redisClient.set(tokenKey, token, { EX: expirationSeconds });
        console.log(`Stored refreshed ${tokenKey} in Redis with ${expirationSeconds}s expiration`);
      } catch (redisError) {
        console.error(`Redis error while storing refreshed ${tokenKey}:`, redisError);
      }
    }

    return token;
  } catch (error) {
    console.error(`Error force refreshing ${tokenKey}:`, error);
    throw error;
  }
}

/**
 * Get value from Redis
 * @param {string} key - Redis key
 * @returns {Promise<string|null>} - The value or null if not found
 */
export async function redisGet(key) {
  try {
    if (!isConnected) {
      return null;
    }
    return await redisClient.get(key);
  } catch (error) {
    console.error(`Redis GET error for key ${key}:`, error);
    return null;
  }
}

/**
 * Set value in Redis with optional expiration
 * @param {string} key - Redis key
 * @param {string} value - Value to store
 * @param {number} expirationSeconds - Optional expiration in seconds
 * @returns {Promise<boolean>} - Success status
 */
export async function redisSet(key, value, expirationSeconds = null) {
  try {
    if (!isConnected) {
      return false;
    }

    if (expirationSeconds && expirationSeconds > 0) {
      await redisClient.set(key, value, { EX: expirationSeconds });
    } else if (expirationSeconds === 0) {
      // Delete the key
      await redisClient.del(key);
    } else {
      await redisClient.set(key, value);
    }
    
    return true;
  } catch (error) {
    console.error(`Redis SET error for key ${key}:`, error);
    return false;
  }
}

// Export the Redis client for direct use if needed
export { redisClient };