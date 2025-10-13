import app from "./app.js";
import { PORT } from "./config/env.js";
import connectToDB from "./database/mongodb.js";
import logger from "./utils/winstonLogger.js";
import { Server } from "socket.io";
import http from 'http';

process.on('uncaughtException', (error) => {
    logger.error(`UncaughtException: ${error}`)
    process.exit(1);
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on('connection', (socket) => {
    logger.info(`User connected, ${socket.id}`);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        logger.info(`Socket ${socket.id} joined room ${roomId}`)
        
        socket.to(roomId).emit('user-joined', {
            message: `User ${socket.id} joined the room`
        })
    })


    socket.on('disconnected', () => {
        logger.info(`User disconnected ${socket.id}`);
    });
});

const startServer = async () => {
    try {
        await connectToDB();
        // app.listen(PORT, () => {
        //     logger.info(`Server started on port: ${PORT}`);
        // })
        server.listen(PORT, () => {
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