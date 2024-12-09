import { Event } from "@api/event/event.type";
import { isValidAddress, isValidHash } from "@shared/utils/validate";
import { Document, model, Schema } from "mongoose";

type EventDoc = Event & Document;

const EventSchema = new Schema<EventDoc>(
    {
        from: {
            type: String,
            required: true,
            validate: {
                validator: isValidAddress,
                message: (_) => `Invalid from address`,
            },
        },
        to: {
            type: String,
            required: true,
            validate: {
                validator: isValidAddress,
                message: (_) => `Invalid to address`,
            },
        },
        eventData: {
            type: Object,
            required: false,
        },
        blockHash: {
            type: String,
            required: true,
            validate: {
                validator: isValidHash,
                message: (_) => `Invalid block hash`,
            },
        },
        blockNumber: {
            type: Number,
            index: true,
            required: true,
        },
        transactionHash: {
            type: String,
            required: true,
            validate: {
                validator: isValidHash,
                message: (_) => `Invalid transaction hash`,
            },
        },
    },
    {
        timestamps: true,
        collection: "Events",
    },
);

const EventModel = model<EventDoc>("Event", EventSchema);

export default EventModel;
