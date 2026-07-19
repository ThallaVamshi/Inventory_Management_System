const mongoose = require("mongoose");

const stockMovementSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            default: null
        },

        type: {
            type: String,
            enum: ["IN", "OUT"],
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        remarks: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("StockMovement", stockMovementSchema);