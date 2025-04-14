import { Server } from "socket.io";
import logger from "../logger/logger";
import { verifyToken } from "../utils/jwt";

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
        socket.send("Hello from server");

        const jwtToken = socket.handshake.auth.token;
        logger.info(`JWT token: ${jwtToken}`);
        if (!jwtToken) {
            socket.emit("error", "Missing token in socket connection");
            socket.disconnect(true);
            return
        }
        const decoded = verifyToken(jwtToken);
        if (!decoded) {
            socket.emit("error", "Invalid token in socket connection");
            socket.disconnect(true);
            return
        }

        const userId = decoded.id;
        socket.join(userId);

        socket.on("disconnect", () => {
            logger.info(`User disconnected: socketId ${socket.id}`);
            socket.leave(userId);
            socket.disconnect(true);
        });
    });
}

export function sendWebSocketNotification(userId: string, notification: any) {
    io.to(userId).emit("notification", JSON.stringify(notification));
}
