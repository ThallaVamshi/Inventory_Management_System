const StockMovement = require("../models/StockMovement");
const Product = require("../models/Product");

// ==========================================
// Stock In
// ==========================================
const stockIn = async (req, res) => {
    try {

        const { product, supplier, quantity, remarks } = req.body;

        const existingProduct = await Product.findById(product);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        existingProduct.availableQuantity += Number(quantity);

        await existingProduct.save();

        const movement = await StockMovement.create({
            product,
            supplier,
            quantity,
            remarks,
            type: "IN"
        });

        res.status(201).json({
            success: true,
            message: "Stock added successfully",
            data: movement
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ==========================================
// Stock Out
// ==========================================
const stockOut = async (req, res) => {
    try {

        const { product, quantity, remarks } = req.body;

        const existingProduct = await Product.findById(product);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (existingProduct.availableQuantity < quantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock available"
            });
        }

        existingProduct.availableQuantity -= Number(quantity);

        await existingProduct.save();

        const movement = await StockMovement.create({
            product,
            quantity,
            remarks,
            type: "OUT"
        });

        res.status(201).json({
            success: true,
            message: "Stock removed successfully",
            data: movement
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ==========================================
// Stock History
// ==========================================
const getStockHistory = async (req, res) => {
    try {

        const history = await StockMovement.find()
            .populate("product", "productName sku")
            .populate("supplier", "supplierName")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    stockIn,
    stockOut,
    getStockHistory
};