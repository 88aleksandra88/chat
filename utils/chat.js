const {
    userJoin,
    userLeave,
    getRoomUsers,
    getCurrentUser,
} = require("./users");
const Message = require("../models/Message");
const formatMessage = require("./messages");
const chatBot = require("../server");

const message = (socket, io, msg) => {
    const user = getCurrentUser(socket.id);
    const message = new Message(formatMessage(user.username, msg));

    message.save();
    io.to(user.room).emit("output", [message]);
};

exports.disconnect = (socket, io, chatBot) => {
    const user = userLeave(socket.id);

    if (user) {
        const disconnect = new Message(
            formatMessage(chatBot, `${user.username} has left the chat`)
        );
        io.to(user.room).emit("output", [disconnect]);
        disconnect.save();

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    }
};

exports.joinRoom = (socket, io, username, room, chatBot) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Get chats from mongo collection
    Message.find()
        .then(data => {
            // Emit the messages
            socket.emit("output", data);
        })
        .catch(err => console.log(err));

    // Welcome current user
    const welcome = new Message(formatMessage(chatBot, "Welcome to ChatCord!"));
    socket.emit("output", [welcome]);

    // Broadcast when a user connects
    const connect = new Message(
        formatMessage(chatBot, `${user.username} has joined the chat`)
    );
    connect.save();
    socket.broadcast.to(user.room).emit("output", [connect]);

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
    });
};
