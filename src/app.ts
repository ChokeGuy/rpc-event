import router from "@api/app.route";
import { handleError, handleNotFound } from "@shared/middlewares/errorHandler";
import { requestTracker } from "@shared/middlewares/requestTracker";
import compression from "compression";
import morgan from "morgan";
import express from "express";

import "@domain/db/init.mongodb";
import "@domain/db/init.redis";

const app = express();

app.use(express.json());
app.use(requestTracker);
app.use(compression());

morgan.token("request-time", () => {
    return new Date().toISOString();
});

app.use(
    morgan(
        ":request-time :method :url :status :res[content-length] - :response-time ms",
    ),
);

app.use("/api/v1", router);
app.use(handleNotFound);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(handleError as any);

export default app;
