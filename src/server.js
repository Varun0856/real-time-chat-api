import app from "./app.js";
import { PORT } from "./config/env.js";
import connectToDB from "./database/mongodb.js";
import logger from "./utils/winstonLogger.js";
import { Server } from "socket.io";
import http from 'http';
import { setupSocket } from "./socket/socket.handler.js";


process.on('uncaughtException', (error) => {
    logger.error(`UncaughtException: ${error}`)
    process.exit(1);
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

setupSocket(io);

const startServer = async () => {
    try {
        await connectToDB();
        // app.listen(PORT, () => {
        //     logger.info(`Server started on port: ${PORT}`);
        // })
        server.listen(PORT || 3000, '0.0.0.0', () => {
            logger.info(`Server started on port: ${PORT}`)
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
