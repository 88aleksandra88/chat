const path = require("path");
const http = require("http");
const express = require("express");
const router = express.Router();
const socketio = require("socket.io");
const connectDB = require("./db");
const chat = require("./utils/chat");
const userRoutes = require("./routes/user");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Set routes
app.use("/auth", userRoutes);

const chatBot = "ChatCord Bot";

// Run when client connects
io.on("connection", socket => {

    socket.on("joinRoom", ({ username, room }) =>chat.joinRoom(socket, io, username, room) );

    // Listen for chatMessage
    socket.on("chatMessage", msg => chat.message(socket, io, msg));

    // Runs when client disconnects
    socket.on("disconnect", () => chat.disconnect(socket, io));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


exports.chatBot = chatBot;