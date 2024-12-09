import { BadRequestError } from "@shared/lib/http/httpError";

const isValidHash = (value: string): boolean =>
    /^0x[a-fA-F0-9]{64}$/.test(value);

const isValidAddress = (value: string): boolean =>
    /^0x[a-fA-F0-9]{40}$/.test(value);

const validateAddress = (value: string) => {
    if (!isValidAddress(value)) {
        throw new BadRequestError();
    }

    return value;
};

const validateBlock = (value: string) => {
    if (Number.isNaN(Number(value)) && !isValidHash(value)) {
        throw new BadRequestError();
    }

    return value;
};

const validateHash = (value: string) => {
    if (!isValidHash(value)) {
        throw new BadRequestError();
    }
};

export {
    isValidAddress,
    isValidHash,
    validateAddress,
    validateBlock,
    validateHash,
};
