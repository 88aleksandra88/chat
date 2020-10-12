const mongoose = require("mongoose");

const Message = new mongoose.Schema({
    username: { type: String, required: true },
    text: { type: String, required: true },
    time: { type: String, required: true },
});

module.exports = mongoose.model("Message", Message);
