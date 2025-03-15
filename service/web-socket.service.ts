import { Server } from "socket.io";

let io: Server;

export function initWebSocket(server: any) {
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("subscribe", (userId: string) => {
            socket.join(userId);
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
}

export function sendWebSocketNotification(userId: string, notification: any) {
    io.to(userId).emit("notification", JSON.stringify(notification));
}
