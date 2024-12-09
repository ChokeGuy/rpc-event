import * as dotenv from "dotenv";
import { NodeEnv } from "src/shared/constant/config";

dotenv.config();

interface Config {
    port: number;
    nodeEnv: NodeEnv;
    dbHost: string;
    dbPort: number;
    redisPort: number;
    redisHost: string;
    defaultBlockScan: number;
    dbName: string;
    writeLogFile: boolean;
}

const config: Config = {
    port: Number(process.env.port ?? "3000"),
    dbHost: process.env.DB_HOST ?? "localhost",
    dbPort: Number(process.env.DB_PORT ?? "27017"),
    dbName: process.env.DB_NAME ?? "event-db",
    redisHost: process.env.REDIS_HOST ?? "localhost",
    redisPort: Number(process.env.REDIS_PORT ?? "6379"),
    defaultBlockScan: Number(process.env.DEFAULT_BLOCK_SCAN ?? "2000"),
    nodeEnv: (process.env.NODE_ENV as NodeEnv) ?? NodeEnv.DEV,
    writeLogFile: process.env.NODE_ENV !== "DEV",
};

export default config;
