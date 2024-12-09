type Event = {
    from: string;
    to: string;
    eventData: {
        [key: string]: string | number;
    } | null;
    blockHash: string;
    blockNumber: number;
    transactionHash: string;
};

type BlockRange = {
    blockStart: number;
    blockEnd: number;
};

export type { BlockRange, Event };
