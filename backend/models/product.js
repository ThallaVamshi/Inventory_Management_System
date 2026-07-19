const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true
        },

        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        unitPrice: {
            type: Number,
            required: true,
            min: 0
        },

        unitOfMeasure: {
            type: String,
            required: true,
            trim: true
        },

        reorderLevel: {
            type: Number,
            required: true,
            min: 0
        },

        availableQuantity: {
            type: Number,
            default: 0,
            min: 0
        },

        description: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);