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
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        logger.info(`User connected: ${socket.id}`);

        socket.on("subscribe", (userId: string) => {
            socket.join(userId);
        });

        socket.on("disconnect", () => {
            logger.info(`User disconnected: ${socket.id}`);
        });
    });
}

export function sendWebSocketNotification(userId: string, notification: any) {
    io.to(userId).emit("notification", JSON.stringify(notification));
}
