import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
let redisClient = null;

try {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.warn("REDIS_URL not configured - Running without cache");
  } else {
    redisClient = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 10000,
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error("Redis connection failed after 10 retries");
            return new Error("Redis connection failed");
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    redisClient.on("error", (err) => {
      console.warn("Redis Client Error:", err.message);
    });

    redisClient.on("connect", () => {
      console.log("Redis connected successfully");
    });

    await redisClient.connect();
  }
} catch (error) {
  console.warn("Redis not available - Running without cache:", error.message);
  redisClient = null;
}

export default redisClient;
