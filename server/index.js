import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http"; // Import HTTP module
import { Server } from "socket.io"; // Import Socket.io
import authRoutes from "./routes/authRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import User from "./models/User.js";
import Message from "./models/Message.js"; // We need this to save messages

dotenv.config();


// Allow both localhost (for testing) and your future production URL
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL // We will set this on Render later
];



const app = express();

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


 
app.use("/api/auth", authRoutes); 
app.use("/api", dataRoutes);


// --- SOCKET.IO SETUP ---
const server = http.createServer(app); // Wrap Express

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // 1. Get user ID from query (we will send this from frontend)
  const userId = socket.handshake.query.userId;
  
  if (userId) {
    // Update DB to Online
    User.findByIdAndUpdate(userId, { isOnline: true }).then(() => {
      // Notify everyone this user is online
      io.emit("user_status_change", { userId, isOnline: true });
    });
    console.log(`User ${userId} connected`);
  }

  // 2. Join Channel
  socket.on("join_channel", (channelId) => {
    socket.join(channelId);
  });

  // 3. Handle Send Message
  socket.on("send_message", async (data) => {
    try {
      const newMessage = await Message.create(data);
      const populatedMessage = await newMessage.populate("sender", "username");
      io.to(data.channel).emit("receive_message", populatedMessage);
    } catch (error) {
      console.error(error);
    }
  });

  // 4. Handle Disconnect
  socket.on("disconnect", async () => {
    if (userId) {
      // Update DB to Offline
      await User.findByIdAndUpdate(userId, { isOnline: false });
      // Notify everyone
      io.emit("user_status_change", { userId, isOnline: false });
    }
  });
});

const PORT = process.env.PORT || 5000;
// Note: We listen on 'server', not 'app'
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
