import {
    CreatedHttpResponse,
    OkHttpResponse,
} from "@shared/lib/http/httpResponse";
import { NextFunction, Request, Response } from "express";

export function OkResponse(message?: string) {
    return function (
        _target: unknown,
        _propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (
            req: Request,
            res: Response,
            next: NextFunction,
        ) {
            const result = await originalMethod.apply(this, [req, res, next]);
            return new OkHttpResponse(result, message).send(res);
        };
    };
}

export function CreatedResponse(message?: string) {
    return function (
        _target: unknown,
        _propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (
            req: Request,
            res: Response,
            next: NextFunction,
        ) {
            const result = await originalMethod.apply(this, [req, res, next]);
            return new CreatedHttpResponse(result, message).send(res);
        };
    };
}
