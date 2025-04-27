import { io, Socket } from "socket.io-client";

// Connect to the Socket.IO server
const socket: Socket = io("http://localhost:5000", {
    auth: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg3ZWE0YTViLTczYTAtNDgxZi1iNzZhLWEwMWZkNjJmYWU4MCIsImRpc3BsYXlOYW1lIjpudWxsLCJ1c2VybmFtZSI6InRoYWluZ3V5ZW4iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc0NTQ4MDgyMiwiZXhwIjoxNzQ4MDcyODIyfQ.u6KaaLxKnKtqMHveVq92Uu21c-hfcoithEMK9PPt4Xs"
    }
});

process.stdin.on("data", (data) => {
});

(async () => {
        socket.on("connect", () => {
            console.log("Connected with ID:", socket.id);

            // Emit subscription event
            socket.emit("subscribe", "test");

            // Listen for notifications
            socket.on("notification", (data) => {
                console.log("Received notification:", data);
            });

            socket.on("refresh", (data) => {
                console.log("refresh:", data);
            });
        });
    })()


