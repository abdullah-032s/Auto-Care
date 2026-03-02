const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("AutoCare Socket Server is running!");
});

// In-memory users list (resets on each serverless cold-start, acceptable for polling mode)
let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiverId) => {
    return users.find((user) => user.userId === receiverId);
};

const createMessage = ({ senderId, receiverId, text, images }) => ({
    senderId,
    receiverId,
    text,
    images,
    seen: false,
});

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io with polling transport (compatible with Vercel serverless)
const io = new Server(httpServer, {
    cors: {
        origin: [
            "https://auto-care-frontend.vercel.app",
            "https://frontend-phi-rouge-27.vercel.app",
            "http://localhost:3000",
        ],
        methods: ["GET", "POST"],
        credentials: true,
    },
    transports: ["polling"],
    allowEIO3: true,
});

io.on("connection", (socket) => {
    console.log(`a user is connected: ${socket.id}`);

    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    const messages = {};

    socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
        const message = createMessage({ senderId, receiverId, text, images });
        const user = getUser(receiverId);

        if (!messages[receiverId]) {
            messages[receiverId] = [message];
        } else {
            messages[receiverId].push(message);
        }

        io.to(user?.socketId).emit("getMessage", message);
    });

    socket.on("messageSeen", ({ senderId, receiverId, messageId }) => {
        const user = getUser(senderId);
        if (messages[senderId]) {
            const message = messages[senderId].find(
                (message) =>
                    message.receiverId === receiverId && message.id === messageId
            );
            if (message) {
                message.seen = true;
                io.to(user?.socketId).emit("messageSeen", {
                    senderId,
                    receiverId,
                    messageId,
                });
            }
        }
    });

    socket.on("updateLastMessage", ({ lastMessage, lastMessagesId }) => {
        io.emit("getLastMessage", {
            lastMessage,
            lastMessagesId,
        });
    });

    socket.on("disconnect", () => {
        console.log(`a user disconnected: ${socket.id}`);
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});

// Export as Vercel serverless handler
module.exports = (req, res) => {
    httpServer.emit("request", req, res);
};
