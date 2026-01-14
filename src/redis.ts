import { createClient } from "redis";

export const redis = createClient({ socket: { host: "redis-cache" } });

redis.on("error", console.error);

await redis.connect();
