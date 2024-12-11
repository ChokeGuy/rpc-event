import { start } from "./http-connection";
const PROVIDER_URLS = process.env.SEPOLIA_PROVIDER_URL!;
import { network } from "hardhat";

import "../domain/db/init.redis";
import { ContractABI } from "../types";

async function main() {
  const chainId = network.config.chainId!;
  const contractAddress = "";
  const providerUrls = PROVIDER_URLS.split(",");
  const contractAbi: ContractABI = [];

  await start(providerUrls, chainId, contractAddress, contractAbi);
}

main().catch(console.error);
