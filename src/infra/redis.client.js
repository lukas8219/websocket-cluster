import redis from 'redis';

export const redisClient = await redis.createClient();