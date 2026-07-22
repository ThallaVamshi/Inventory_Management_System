const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const inspectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected successfully!");

        // List users
        const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }), "users");
        const users = await User.find({});
        console.log("\n--- Current Users in DB ---");
        users.forEach(u => console.log(`- Name: ${u.name} | Email: ${u.email} | Role: ${u.role} | Password Hash: ${u.password}`));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

inspectDB();
