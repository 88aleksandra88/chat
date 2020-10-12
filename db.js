const mongoose = require("mongoose");

const connectDB = () => {
    mongoose
        .connect(
            "mongodb+srv://dev123:dev123@epictete.ahqdx.mongodb.net/chat?retryWrites=true&w=majority",
            { useNewUrlParser: true, useUnifiedTopology: true }
        )
        .then(() => console.log("Connected to MongoDB"))
        .catch(err => console.log(err));
};

module.exports = connectDB;
