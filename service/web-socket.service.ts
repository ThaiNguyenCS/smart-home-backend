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
        const userId = authenticateSocket(socket);
        if (!userId) {
            return;
        }
        socket.join(userId); // join room
        registerDisconnectHandler(socket, userId)
    });
}

function authenticateSocket(socket: any) {
    const jwtToken = socket.handshake.auth.token;
    logger.info(`JWT token: ${jwtToken}`);
    if (!jwtToken) {
        socket.emit("error", "Missing token in socket connection");
        socket.disconnect(true);
        return null;
    }
    const decoded = verifyToken(jwtToken);
    if (!decoded) {
        socket.emit("error", "Invalid token in socket connection");
        socket.disconnect(true);
        return null;
    }
    return decoded.id
}


export function sendWebSocketNotification(userId: string, notification: any) {
    io.to(userId).emit("notification", JSON.stringify(notification));
}

function registerDisconnectHandler(socket: any, userId: string) {
    socket.on("disconnect", () => {
        logger.info(`User disconnected: socketId ${socket.id}`);
        socket.leave(userId);
        socket.disconnect(true);
    });
}
