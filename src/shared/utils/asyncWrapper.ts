import { NextFunction, Request, Response } from "express";

type Func<T> = (req: Request, res: Response, next: NextFunction) => Promise<T>;

export const asyncWrapper = <T>(fn: Func<T>) => {
    return (req: Request, res: Response, next: NextFunction) =>
        fn(req, res, next).catch((error) => {
            next(error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as T as any;
};
