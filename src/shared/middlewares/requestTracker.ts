import config from "@config/index";
import { NodeEnv } from "@shared/constant/config";
import logger from "@shared/lib/logger";
import * as lodash from "lodash";
import { v4 as uuidV4 } from "uuid";
import { NextFunction, Request, Response } from "express";

export const requestTracker = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    req.headers["x-request-id"] = req.headers["x-request-id"] ?? uuidV4();
    const loggerFields = ["body", "query", "headers['x-request-id']"];
    if (config.nodeEnv === NodeEnv.DEV) {
        loggerFields.forEach((field) =>
            requestLogger(lodash.get(req, field), field),
        );
    }
    next();
};

const requestLogger = (reqField: object | null, fieldName: string) => {
    if (reqField && Object.keys(reqField).length > 0) {
        logger.debug({ field: fieldName, value: reqField });
    }
};
