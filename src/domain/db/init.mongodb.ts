import env from "@config/index";
import logger from "@shared/lib/logger";
import mongoose from "mongoose";

class Database {
    connectString = `mongodb://${env.dbHost}:${env.dbPort}`;

    private static instance: Database;
    private constructor() {
        this.connect();
    }

    private connect(_type: string = "mongodb"): void {
        mongoose.set("debug", true);
        mongoose.set("debug", { color: true });
        mongoose
            .connect(this.connectString, {
                dbName: env.dbName,
            })
            .then(async () => logger.info(`Connected to MongoDB Success`))
            .catch((err: Error) => logger.error(err.stack!));
    }
    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const database = Database.getInstance();

export default database;
