const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const StockMovement = require("../models/StockMovement");
const Product = require("../models/product");

const cleanupDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected successfully!");

        console.log("Fetching all stock movements...");
        const movements = await StockMovement.find({});
        console.log(`Found ${movements.length} total stock movements.`);

        let deletedCount = 0;

        for (const movement of movements) {
            // Check if product exists
            if (!movement.product) {
                console.log(`Removing movement with empty product ID: ${movement._id}`);
                await StockMovement.findByIdAndDelete(movement._id);
                deletedCount++;
                continue;
            }

            const productExists = await Product.findById(movement.product);
            if (!productExists) {
                console.log(`Removing movement with non-existent product ID (${movement.product}): ${movement._id}`);
                await StockMovement.findByIdAndDelete(movement._id);
                deletedCount++;
            }
        }

        console.log(`\n✅ Database cleanup complete. Deleted ${deletedCount} orphaned stock movements.`);
        await mongoose.disconnect();
    } catch (err) {
        console.error("❌ Error running cleanup:", err);
        process.exit(1);
    }
};

cleanupDB();
