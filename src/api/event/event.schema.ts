import {
    validateAddress,
    validateBlock,
    validateHash,
} from "@shared/utils/validate";
import Joi, { CustomHelpers } from "joi";

import { BlockRange, Event } from "./event.type";

const createEvent = Joi.object<Event>({
    from: Joi.string().custom(validateAddress).required().messages({
        "any.custom": `"from" must be a valid Ethereum address`,
        "any.required": `"from" is a required field`,
    }),
    to: Joi.string().custom(validateAddress).required().messages({
        "any.custom": `"to" must be a valid Ethereum address`,
        "any.required": `"to" is a required field`,
    }),
    eventData: Joi.object().optional(),
    blockHash: Joi.string().custom(validateHash).required().messages({
        "any.custom": `"blockHash" must be a valid Ethereum hash`,
        "any.required": `"blockHash" is a required field`,
    }),
    blockNumber: Joi.number().integer().positive().required().messages({
        "number.base": `"blockNumber" must be a number`,
        "any.required": `"blockNumber" is a required field`,
    }),
    transactionHash: Joi.string().custom(validateHash).required().messages({
        "any.custom": `"transactionHash" must be a valid Ethereum hash`,
        "any.required": `"transactionHash" is a required field`,
    }),
});

const getEventByBlock = Joi.object({
    block: Joi.string().custom(validateBlock).required().messages({
        "any.custom": `"block" must be a number or Ethereum hash`,
        "any.required": `"block" is a required field`,
    }),
});

const getEventByBlockNumberRange = Joi.object<BlockRange>({
    blockStart: Joi.number().integer().positive().required(),
    blockEnd: Joi.number().integer().positive().required(),
})
    .with("blockStart", "blockEnd")
    .custom((values: BlockRange, helpers: CustomHelpers) => {
        if (values.blockStart >= values.blockEnd) {
            return helpers.message({
                custom: "blockStart must be less than blockEnd",
            });
        }
    })
    .messages({
        "any.custom": `"blockStart" must be a number less than "blockEnd"`,
    });

const getEventByTransaction = Joi.object({
    transaction: Joi.string().custom(validateHash).required().messages({
        "any.custom": `"transaction" must be a valid Ethereum hash`,
        "any.required": `"transaction" is a required field`,
    }),
});

const eventSchema = {
    createEvent,
    getEventByBlock,
    getEventByTransaction,
    getEventByBlockNumberRange,
};

export default eventSchema;
