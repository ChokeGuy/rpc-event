import { ethers, JsonRpcProvider, Log, Result } from "ethers";
import env from "../config/index";
import {
  getBlockScan,
  getRedisClient,
  setBlockScan,
} from "../domain/db/init.redis";
import api from "../domain/apis/connect.api";
import { BlockRange, Event } from "../types/event-types";
import { ContractABI } from "../types";
import { RedisClientType } from "redis";
require("dotenv").config();

const POLLING_INTERVAL = 12 * 1000;
const RESCAN_BLOCK = 5;

class ResilientHttpProvider {
  private provider: JsonRpcProvider | null = null;
  private redis!: RedisClientType;
  private readonly url: string;
  private readonly chainId: number;
  private readonly contractAddress: string;
  private readonly contractAbi: ContractABI;
  private readonly topics: string[] = [];
  private pollingInterval: NodeJS.Timeout | null = null;
  private isPolling: boolean = false;
  private blockScan: number = env.defaultBlockScan;

  constructor(
    url: string,
    chainId: number,
    contractAddress: string,
    contractAbi: ContractABI,
    topics: string[] = []
  ) {
    this.url = url;
    this.chainId = chainId;
    this.contractAddress = contractAddress;
    this.contractAbi = contractAbi;
    this.topics = topics;
  }

  async connect(): Promise<JsonRpcProvider> {
    try {
      this.provider = new JsonRpcProvider(this.url, this.chainId);
      this.redis = await getRedisClient();
      this.startPolling();
      return this.provider;
    } catch (error) {
      console.error(
        `Error initializing JsonRpcProvider for ${this.url}:`,
        error
      );
      return this.connect();
    }
  }

  private async startPolling() {
    if (this.isPolling) return;
    this.isPolling = true;

    this.pollingInterval = setInterval(async () => {
      try {
        this.blockScan = await getBlockScan();

        const currentBlock = await this.provider?.getBlockNumber()!;
        console.log(
          `Start polling from block ${this.blockScan} to block ${currentBlock}:`
        );

        //currentBlock: 20 -> [19,18,17]
        //currentBlock: 21 -> [20,19,18]
        const blocksToRescan = Array.from(
          { length: RESCAN_BLOCK },
          (_, i) => currentBlock - 1 - i
        );

        console.log("Rescan blocks:", blocksToRescan);

        await Promise.all(
          blocksToRescan.map(async (blockNumber) => {
            const index = currentBlock - blockNumber;
            const cachedEvents = await this.redis.sMembers(
              `events_pre_${index}_block`
            );

            if (!cachedEvents) return;
            console.log("Block number:", blockNumber);
            await this.reScanEvents(blockNumber, cachedEvents, index);
          })
        );

        if (currentBlock - this.blockScan > 50000)
          this.blockScan = currentBlock - 50000;

        await this.scanEvents({
          blockStart: this.blockScan,
          blockEnd: currentBlock,
        });

        await setBlockScan(currentBlock + 1);
      } catch (error) {
        console.error("Polling error:", error);
        await this.reconnect();
      }
    }, POLLING_INTERVAL);
  }

  private async scanEvents(blockRange: BlockRange) {
    try {
      const filter = {
        fromBlock: blockRange.blockStart,
        toBlock: blockRange.blockEnd,
        address: this.contractAddress,
        topics: this.topics,
      };

      const logs = await this.provider?.getLogs(filter)!;

      const currentEvents = await this.getEventsByLogs(logs);

      console.log(
        `New events from block ${blockRange.blockStart} to block ${blockRange.blockEnd}`
      );
      console.log("New events: " + JSON.stringify(currentEvents));

      await Promise.all(
        currentEvents.map(async (event) => {
          await api.createEvent(event);

          if (event.blockNumber >= blockRange.blockEnd - RESCAN_BLOCK) {
            const index = blockRange.blockEnd - event.blockNumber + 1;
            const eventKey = `events_pre_${index}_block`;
            await this.redis.sAdd(eventKey, JSON.stringify(event));
          }
        })
      );
    } catch (error) {
      console.error("Error checking events:", error);
    }
  }

  private async getEventsByLogs(logs: Log[]): Promise<Event[]> {
    const currentEvents: Event[] = await Promise.all(
      logs.map(async (log) => {
        const decodedData = log.data
          ? this.decodeEventData(log.data, log.topics)
          : null;

        const tx = await this.provider?.getTransaction(log.transactionHash);

        const from = tx?.from!;
        const to = tx?.to!;

        const result: Event = {
          from,
          to,
          eventData: decodedData ?? null,
          blockHash: log.blockHash,
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
        };

        return result;
      })
    );

    return currentEvents;
  }

  private decodeEventData(data: string, topics: readonly string[]) {
    try {
      const iface = new ethers.Interface(this.contractAbi);
      const decoded = iface.parseLog({ topics, data });
      if (decoded && decoded.args) {
        const result: { [key: string]: any } = {};
        decoded.fragment.inputs.forEach((input, index) => {
          result[input.name] = decoded.args[index];
        });

        return result;
      }
    } catch (error) {
      console.error("Failed to decode event data:", error);
    }
  }

  private async reScanEvents(
    blockNumber: number,
    cachedEvents: string[],
    index: number
  ) {
    try {
      const filter = {
        blockTag: blockNumber,
        address: this.contractAddress,
        topics: this.topics,
      };

      const logs = await this.provider?.getLogs(filter)!;

      const currentEvents = await this.getEventsByLogs(logs);

      console.log("Current Events", JSON.stringify(currentEvents));

      const cachedEventSets = new Set(cachedEvents);

      console.log("Cached Events", JSON.stringify(cachedEvents));

      const newEvents = currentEvents.filter(
        (event) => !cachedEventSets.has(JSON.stringify(event))
      );

      if (newEvents.length > 0) {
        await Promise.all(
          newEvents.map(async (event) => {
            await api.createEvent(event);
          })
        );
      }
      await this.redis.del(`events_pre_${index}_block`);
    } catch (error) {
      console.error("Error checking events:", error);
    }
  }

  private async reconnect() {
    this.stopPolling();
    await this.connect();
  }

  private stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
  }

  async disconnect() {
    this.stopPolling();
    this.provider = null;
  }
}

async function start(
  providerUrls: string[],
  chainId: number,
  contractAddress: string,
  contractAbi: ContractABI,
  topics?: string[]
) {
  let i = 0;
  while (i < providerUrls.length) {
    try {
      const resilientProvider = new ResilientHttpProvider(
        providerUrls[i],
        chainId,
        contractAddress,
        contractAbi,
        topics
      );
      const provider = await resilientProvider.connect();
      return provider;
    } catch (err) {
      i++;
      console.error("Error creating providers:", err);
    }
  }
}
export { start };
