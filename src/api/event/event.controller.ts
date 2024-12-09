import { CreatedResponse, OkResponse } from "@shared/decorators/response";
import { BadRequestError } from "@shared/lib/http/httpError";
import { NextFunction, Request, Response } from "express";

import eventService from "./event.service";

class EventController {
    @CreatedResponse()
    async createEvent(req: Request, _res: Response, _next: NextFunction) {
        return eventService.createEvent(req.body);
    }

    @OkResponse()
    async getEventByBlock(req: Request, _res: Response, _next: NextFunction) {
        const block = req.query?.block;

        if (typeof block !== "string") {
            throw new BadRequestError();
        }

        return eventService.getEventByBlock(block);
    }

    @OkResponse()
    async getEventByTransaction(
        req: Request,
        _res: Response,
        _next: NextFunction,
    ) {
        const transaction = req.params?.transaction;

        return eventService.getEventByTransaction(transaction);
    }

    @OkResponse()
    async getEventByBlockNumberRange(
        req: Request,
        _res: Response,
        _next: NextFunction,
    ) {
        const { blockStart, blockEnd } = req.query;

        return eventService.getEventByBlockNumberRange(
            Number(blockStart),
            Number(blockEnd),
        );
    }
}

const eventController = new EventController();
export default eventController;
