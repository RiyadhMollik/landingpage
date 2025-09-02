import { createClient } from 'redis';

// Redis connection URL (reuse from your redisTokenManager.js)
const REDIS_URL = 'redis://default:okTSxSLzDQlBMxGWmSclTUEJLdHYjQRo@redis-10491.c81.us-east-1-2.ec2.redns.redis-cloud.com:10491';

async function clearBkashToken() {
  const client = createClient({ url: REDIS_URL });

  try {
    await client.connect();
    console.log('Connected to Redis.');

    const result = await client.del('bkash_token');
    if (result === 1) {
      console.log('bkash_token deleted successfully.');
    } else {
      console.log('bkash_token does not exist or already deleted.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.disconnect();
    console.log('Disconnected from Redis.');
  }
}

clearBkashToken();