import env from "@config/index";
import logger from "@shared/lib/logger";
import { createClient, RedisClientType } from "redis";

class Database {
    private static instance: Database;
    private client: RedisClientType;
    private connectString: string = `redis://${env.redisHost}:${env.redisPort}`;

    private constructor(connectString?: string) {
        this.client = createClient({
            url: connectString || this.connectString,
        });
    }

    private async connect(): Promise<void> {
        try {
            this.client.on("error", (err) => {
                logger.error("Redis Client Error", err);
            });

            await this.client.connect();

            if (this.client.isOpen) {
                logger.info("Connected to Redis successfully");
            }
        } catch (error) {
            logger.error("Failed to connect to Redis: " + error);
        }
    }

    public static async getInstance(): Promise<Database> {
        if (!Database.instance) {
            Database.instance = new Database();
            await Database.instance.connect();
        }
        return Database.instance;
    }

    public getClient(): RedisClientType {
        return this.client;
    }
}

async function getRedisClient() {
    const db = await Database.getInstance();
    return db.getClient();
}

async function getBlockScan(): Promise<number> {
    const redis = await getRedisClient();
    const blockScan = await redis.get("BLOCK_SCAN");

    return blockScan ? Number(blockScan) : env.defaultBlockScan;
}

getRedisClient().catch((err) => logger.error(err));

export { getBlockScan, getRedisClient };
