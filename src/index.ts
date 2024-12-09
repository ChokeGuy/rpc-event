import config from "@config/index";
import logger from "@shared/lib/logger";

import app from "./app";

process.on("uncaughtException", (err) => {
    logger.error(err.stack!);
});

process.on("unhandledRejection", (reason, _) => {
    logger.error(reason as string);
});

app.listen(config.port, () => {
    logger.info(`Server is running with ${config.nodeEnv} environment`);
    logger.info(`Server is running on port ${config.port}`);
});
