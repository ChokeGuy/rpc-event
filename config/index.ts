import * as dotenv from "dotenv";
import { NodeEnv } from "../shared/constant/config";

dotenv.config();

interface Config {
  port: number;
  host: string;
  nodeEnv: NodeEnv;
  redisPort: number;
  redisHost: string;
  defaultBlockScan: number;
}

const config: Config = {
  port: Number(process.env.port ?? "3000"),
  host: process.env.HOST ?? "localhost",
  redisHost: process.env.REDIS_HOST ?? "localhost",
  redisPort: Number(process.env.REDIS_PORT ?? "6379"),
  defaultBlockScan: Number(process.env.DEFAULT_BLOCK_SCAN ?? "2000"),
  nodeEnv: (process.env.NODE_ENV as NodeEnv) ?? NodeEnv.DEV,
};

export default config;
