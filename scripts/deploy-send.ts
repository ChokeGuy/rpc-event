import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();

  // const addr = await deploy("Event");

  const contract = await ethers.getContractAt(
    "Event",
    "0x8659C203ff702ABdA5e8eA140378825cdAe9F5aB"
  );

  const hash = await contract.sendMessage(
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    `Hello ${"0x70997970c51812dc3a010c7d01b50e0d17dc79c8"} from ${
      owner.address
    }`
  );

  console.log(hash);
}

async function deploy(name: string, args: any[] = []) {
  const TOKEN = await ethers.getContractFactory(name);

  const token = await TOKEN.deploy(...args);

  await token.waitForDeployment();
  const addr = await token.getAddress();

  console.log(`${name} deployed to: ${addr}`);

  return addr;
}

main().catch(console.error);
