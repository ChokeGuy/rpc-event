import config from "src/config";
import { NextFunction, Request, Response } from "express";

import { NodeEnv } from "../constant/config";
import { HttpError, NotFoundError } from "../lib/http/httpError";

export const handleNotFound = (
    _req: Request,
    _res: Response,
    next: NextFunction,
) => {
    next(new NotFoundError());
};

export const handleError = (
    error: HttpError,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    if (config.nodeEnv === NodeEnv.DEV) {
        return res.status(error.statusCode ?? 500).json({
            message: error.message,
            statusCode: error.statusCode,
            data: null,
            stack: error.stack,
        });
    }

    return res.status(error.statusCode ?? 500).json({
        message: error.message,
        statusCode: error.statusCode,
        data: null,
    });
};
