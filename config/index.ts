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
  bsContractAddress: string;
  bsProviderUrls: string;
}

const config: Config = {
  port: Number(process.env.port ?? "4000"),
  host: process.env.HOST ?? "localhost",
  nodeEnv: (process.env.NODE_ENV as NodeEnv) ?? NodeEnv.DEV,
  redisHost: process.env.REDIS_HOST ?? "localhost",
  redisPort: Number(process.env.REDIS_PORT ?? "6379"),
  defaultBlockScan: Number(process.env.DEFAULT_BLOCK_SCAN ?? "2000"),
  bsContractAddress: process.env.BS_CONTRACT_ADDRESS ?? "",
  bsProviderUrls: process.env.BS_PROVIDER_URLS ?? "",
};

export default config;
