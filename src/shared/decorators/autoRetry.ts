import { BadRequestError } from "@shared/lib/http/httpError";
import logger from "@shared/lib/logger";
import { delay } from "@shared/utils/delay";

export function AutoRetry(
    retryTimes: number = 5,
    delayTime: number | null = null, // Millisecond
) {
    return function (
        _target: unknown,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: unknown[]) {
            do {
                try {
                    return await originalMethod.apply(this, args);
                } catch (error) {
                    logger.info(
                        `${propertyKey} auto retry times left: ${retryTimes}`,
                    );
                    retryTimes -= 1;
                    if (delayTime) await delay(delayTime);
                    logger.error((error as Error).message);
                }
            } while (retryTimes > 0);
            throw new BadRequestError("Try limit exceeded");
        };
        return descriptor;
    };
}
