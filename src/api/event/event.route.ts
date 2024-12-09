import { validator } from "@shared/middlewares/validator";
import { asyncWrapper } from "@shared/utils/asyncWrapper";
import express from "express";

import eventController from "./event.controller";
import eventSchema from "./event.schema";

const eventRouter = express.Router();

eventRouter.post(
    "/",
    validator({
        body: eventSchema.createEvent,
    }),
    asyncWrapper(eventController.createEvent),
);

eventRouter.get(
    "/",
    validator({
        query: eventSchema.getEventByBlock,
    }),
    asyncWrapper(eventController.getEventByBlock),
);

eventRouter.get(
    "/range",
    validator({
        query: eventSchema.getEventByBlockNumberRange,
    }),
    asyncWrapper(eventController.getEventByBlockNumberRange),
);

eventRouter.get(
    "/:transaction",
    validator({
        params: eventSchema.getEventByTransaction,
    }),
    asyncWrapper(eventController.getEventByTransaction),
);

export default eventRouter;
