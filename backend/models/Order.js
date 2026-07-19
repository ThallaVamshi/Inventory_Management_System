const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    }
});

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true
        },
        orderDate: {
            type: Date,
            default: Date.now
        },
        expectedDeliveryDate: {
            type: Date,
            required: true
        },
        customerName: {
            type: String,
            required: true,
            trim: true
        },
        customerEmail: {
            type: String,
            trim: true,
            lowercase: true
        },
        customerPhone: {
            type: String,
            trim: true
        },
        items: [orderItemSchema],
        subtotal: {
            type: Number,
            required: true,
            min: 0
        },
        discountAmount: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },
        taxAmount: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },
        grandTotal: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

// Generate unique order number before validation
orderSchema.pre("validate", function (next) {
    if (!this.orderNumber) {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const randomStr = Math.floor(1000 + Math.random() * 9000);
        this.orderNumber = `ORD-${dateStr}-${randomStr}`;
    }
    next();
});

module.exports = mongoose.model("Order", orderSchema);