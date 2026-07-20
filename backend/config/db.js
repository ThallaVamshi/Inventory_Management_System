const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("Connecting to:", process.env.MONGODB_URI);

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.error("Connection Error:");
        console.error(err.name);
        console.error(err.message);
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB;