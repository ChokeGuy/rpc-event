import express from "express";

import healthCheckRouter from "./event/event.route";

const router = express.Router();
router.use("/event", healthCheckRouter);

export default router;
