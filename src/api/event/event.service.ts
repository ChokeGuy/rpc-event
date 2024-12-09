import { getBlockScan, getRedisClient } from "@domain/db/init.redis";
import EventModel from "@domain/models/event.model";
import { isValidHash } from "@shared/utils/validate";

import { Event } from "./event.type";

class EventService {
    async createEvent({
        blockHash,
        blockNumber,
        eventData,
        from,
        to,
        transactionHash,
    }: Event) {
        const _redis = await getRedisClient();
        const blockScan = await getBlockScan();

        let blockCount = blockNumber - blockScan;

        if (blockCount > 3) {
            blockCount = 1;
            await this.setBlockScan(blockNumber - 1);
        }

        const result = await EventModel.create({
            from,
            to,
            blockHash,
            blockNumber,
            eventData,
            transactionHash,
        });

        await _redis.sAdd(`events_pre_${blockCount}`, JSON.stringify(result));

        return result;
    }

    async setBlockScan(blockNumber: number) {
        const _redis = await getRedisClient();
        await _redis.set("BLOCK_SCAN", blockNumber.toString());
    }

    async getEventByBlock(blockIdentifier: string) {
        const query = isValidHash(blockIdentifier)
            ? { blockHash: blockIdentifier }
            : { blockNumber: Number(blockIdentifier) };

        return await EventModel.find(query).exec();
    }

    async getEventByBlockNumberRange(blockStart: number, blockEnd: number) {
        const query = {
            blockNumber: { $gte: blockStart, $lte: blockEnd },
        };

        const result = await EventModel.find(query).exec();

        return result;
    }

    async getEventByTransaction(transaction: string) {
        return await EventModel.find({
            transactionHash: transaction,
        }).exec();
    }
}

const eventService = new EventService();
export default eventService;
