import app from "./app.js";
import { PORT } from "./config/env.js";
import connectToDB from "./database/mongodb.js";
import logger from "./utils/winstonLogger.js";

process.on('uncaughtException', (error) => {
    logger.error(`UncaughtException: ${error}`)
    process.exit(1);
});

const startServer = async () => {
    try {
        await connectToDB();
        app.listen(PORT, () => {
            logger.info(`Server started on port: ${PORT}`);
        })
    } catch (error) {
        logger.error(`Server failed to start: ${error.message}`);
        process.exit(1);
    }
};

startServer();

process.on('unhandledRejection', (error) => {
    logger.error(`UnhandledRejection: ${error}`);
})