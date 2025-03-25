import { Server } from "socket.io";
import logger from "../logger/logger";

let io: Server;

export function initWebSocket(server: any) {
    if (!server) {
        logger.error("No HTTP server provided to WebSocket");
        return;
    }
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        logger.info(`User connected: ${socket.id}`);
        socket.send('Hello from server');
        socket.on("connect", () => {
            // console.log("Connected to Socket.IO server");
            logger.info(`User connect: socketId ${socket.id}`);
        });

        socket.on("subscribe", (userId: string) => {
            logger.info(`User ${userId} subscribes to socket server`);
            socket.join(userId);
        });

        socket.on("disconnect", () => {
            logger.info(`User disconnected: socketId ${socket.id}`);
        });
    });
}

export function sendWebSocketNotification(userId: string, notification: any) {
    console.log("here")
    io.to(userId).emit("notification", JSON.stringify(notification));
}
