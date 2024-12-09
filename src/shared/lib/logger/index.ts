import config from "@config/index";
import { NodeEnv } from "@shared/constant/config";
import util from "util";
import { createLogger, format, Logger } from "winston";
import { Console } from "winston/lib/winston/transports";
import DailyRotateFile from "winston-daily-rotate-file";

interface AdditionMessageParams {
    context: string;
    requestId: string;
}

type Message =
    | string
    | object
    | number
    | boolean
    | Message[]
    | { [key: string]: Message };

class CustomLogger {
    logger: Logger;
    constructor(writeLogFile: boolean = config.writeLogFile) {
        this.logger = createLogger({
            level: "debug",
        });

        if (writeLogFile) {
            this.initProd();
        } else {
            this.initDev();
        }
    }

    private initDev() {
        const formatCustom = format.printf(
            ({
                level,
                message,
                context = null,
                requestId = null,
                timestamp,
            }) => {
                const requestIdLog = requestId
                    ? `\n\tRequestId: ${requestId}`
                    : "";
                const contextLog = context ? `\n\tContext: ${context}` : "";
                message =
                    typeof message === "string"
                        ? message
                        : util.inspect(message, { colors: true });

                return `${level} :: ${timestamp} : ${message} ${requestIdLog} ${contextLog}`;
            },
        );

        const errorStackFormat = format((info) => {
            if (info.stack) {
                console.error(info.stack);
                return false;
            }
            return info;
        });

        const consoleTransport = new Console({
            format: format.combine(
                format.colorize(),
                format.simple(),
                format.timestamp({ format: "DD/MM/YYYY HH:mm:ss" }),
                errorStackFormat(),
                formatCustom,
            ),
        });
        this.logger.add(consoleTransport);
    }

    private initProd() {
        const fileFormat = format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            format.json(),
        );
        const errTransport = new DailyRotateFile({
            dirname: "./logs",
            filename: "error-%DATE%.log",
            datePattern: "YYYY-MM-DD-HH",
            maxSize: "20m",
            maxFiles: "14d",
            format: fileFormat,
            level: "error",
        });
        const infoTransport = new DailyRotateFile({
            dirname: "./logs",
            filename: "combined-%DATE%.log",
            datePattern: "YYYY-MM-DD-HH",
            maxSize: "20m",
            maxFiles: "14d",
            format: fileFormat,
        });
        this.logger.add(errTransport);
        this.logger.add(infoTransport);
    }

    info = (message: Message, params?: Partial<AdditionMessageParams>) => {
        this.logger.info({ message, ...params });
    };

    error = (message: Message, params?: Partial<AdditionMessageParams>) => {
        this.logger.error({ message, ...params });
    };

    debug = (message: Message, params?: Partial<AdditionMessageParams>) => {
        if (config.nodeEnv === NodeEnv.DEV) {
            this.logger.debug({ message, ...params });
        }
    };
}

const logger = new CustomLogger();
export default logger;
