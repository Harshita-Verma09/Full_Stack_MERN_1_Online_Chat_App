

















import groupRoutes from "./routes/groupRoutes.js"
import aiRoutes from "./routes/aiRoutes.js"
import jwt from "jsonwebtoken"; //  Make sure to import this
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import conncetDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js"
import http from "http";                     //  Add this
import { Server } from "socket.io";          //  Add this

dotenv.config(); //  Load env variables

const app = express();
const users = new Map(); // userId => socket

conncetDB();

//  Create HTTP server (for Socket.IO to hook into)
const server = http.createServer(app);





// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://mern-stack-online-chat-app.onrender.com"
  ],
  credentials: true,
}));
app.use(express.json());


//  Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", 
      "https://mern-stack-online-chat-app.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});




// Routes

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/groups", groupRoutes);



// Socket.IO Logic
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join and track socket ID
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId; // store for disconnect cleanup
    console.log(`User ${userId} joined with socket ID ${socket.id}`);
    // Emit to everyone: updated online users
    const onlineIds = Array.from(onlineUsers.keys());
    io.emit("updateOnlineUsers", onlineIds);
  });

  // Send a message to another user
  socket.on("sendMessage", (message) => {
    const { sender, receiver } = message;
    const receiverSocketId = onlineUsers.get(receiver?._id);
    const senderSocketId = onlineUsers.get(sender?._id);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", message);
      console.log("📤 Message sent to receiver:", receiverSocketId);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", message); // sender UI
      console.log("📤 Message echoed to sender:", senderSocketId);
    }
  });

  // Injected here: Read Receipt Event
  socket.on("messagesRead", ({ readerId, senderId }) => {
    const senderSocketId = onlineUsers.get(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesRead", { readerId, senderId });
      console.log(` messagesRead emitted to sender (${senderId})`);
    } else {
      console.log(` No socket found for sender ${senderId}`);
    }
  });

  // Handle disconnect and cleanup
  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(` User ${userId} disconnected`);
        break;
      }
    }
    // Emit updated online users after disconnect
    const onlineIds = Array.from(onlineUsers.keys());
    io.emit("updateOnlineUsers", onlineIds);
  });
});


// Start the server using HTTP server (not app.listen)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});