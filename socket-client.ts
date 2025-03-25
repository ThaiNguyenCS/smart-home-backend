import { io, Socket } from "socket.io-client";

// Connect to the Socket.IO server
const socket: Socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("Connected with ID:", socket.id);
    
    // Emit subscription event
    socket.emit("subscribe", "test");

    // Listen for notifications
    socket.on("notification", (data) => {
        console.log("Received notification:", data);
    });
});
