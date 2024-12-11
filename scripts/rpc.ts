import { start } from "./http-connection";
import { network } from "hardhat";
import { contractABI } from "../constants";

import env from "../config/index";
import "../domain/db/init.redis";

async function main() {
  const chainId = network.config.chainId!;
  const contractAddress = env.bsContractAddress;
  const providerUrls = env.bsProviderUrls
    .replace(/[\[\]']/g, "")
    .split(",")
    .map((url) => url.trim());

  console.log("ChainId: ", chainId);
  console.log("Contract Address: ", contractAddress);
  console.log("Provider Urls: ", providerUrls);

  await start(providerUrls, chainId, contractAddress, contractABI);
}

main().catch(console.error);
