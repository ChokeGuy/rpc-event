import express from "express";

import eventRouter from "./event/event.route";

const router = express.Router();
router.use("/event", eventRouter);

export default router;
