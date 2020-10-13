const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const User = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

User.plugin(uniqueValidator);

module.exports = mongoose.model("User", User);
