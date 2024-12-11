import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// This adds support for typescript paths mappings
import "tsconfig-paths/register";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.27" }],
  },
  sourcify: {
    enabled: false,
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    base_sepolia: {
      accounts: [process.env.PRIVATE_KEY!],
      url: "https://sepolia.base.org",
      chainId: 84532,
    },
    sepolia: {
      accounts: [process.env.PRIVATE_KEY!],
      url: "https://sepolia.drpc.org",
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BS_API_KEY!,
      sepolia: process.env.SEPOLIA_API_KEY!,
    },
  },
};

export default config;
