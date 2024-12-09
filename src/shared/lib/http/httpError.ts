import reasonPhrases from "./reasonPhrases";
import statusCodes from "./statusCodes";

export class HttpError extends Error {
    statusCode: number;

    constructor(
        message: string = reasonPhrases.BAD_REQUEST,
        statusCode: number = statusCodes.BAD_REQUEST,
    ) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class BadRequestError extends HttpError {}

export class ConflictError extends HttpError {
    constructor(
        message: string = reasonPhrases.CONFLICT,
        statusCode: number = statusCodes.CONFLICT,
    ) {
        super(message, statusCode);
    }
}

export class UnauthorizedError extends HttpError {
    constructor(
        message: string = reasonPhrases.UNAUTHORIZED,
        statusCode: number = statusCodes.UNAUTHORIZED,
    ) {
        super(message, statusCode);
    }
}

export class NotFoundError extends HttpError {
    constructor(
        message: string = reasonPhrases.NOT_FOUND,
        statusCode: number = statusCodes.NOT_FOUND,
    ) {
        super(message, statusCode);
    }
}
