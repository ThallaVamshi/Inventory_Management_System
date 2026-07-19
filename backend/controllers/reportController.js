const Order = require("../models/Order");
const Product = ../models/product;
const StockMovement = require("../models/StockMovement");

// ==========================================
// Sales Report (Monthly Sales Report)
// ==========================================
const getSalesReport = async (req, res) => {
    try {
        const monthlySales = await Order.aggregate([
            {
                $match: { status: { $ne: "Cancelled" } }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    revenue: { $sum: "$grandTotal" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": -1, "_id.month": -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: monthlySales
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// Inventory Report (Stock Valuation Report)
// ==========================================
const getInventoryReport = async (req, res) => {
    try {
        const products = await Product.find().sort({ productName: 1 });

        let totalProducts = products.length;
        let totalStockQuantity = 0;
        let totalStockValuation = 0;

        const detailedValuation = products.map(product => {
            const valuation = product.availableQuantity * product.unitPrice;
            totalStockQuantity += product.availableQuantity;
            totalStockValuation += valuation;

            return {
                _id: product._id,
                productName: product.productName,
                sku: product.sku,
                category: product.category,
                availableQuantity: product.availableQuantity,
                unitPrice: product.unitPrice,
                valuation: parseFloat(valuation.toFixed(2)),
                isLowStock: product.availableQuantity <= product.reorderLevel
            };
        });

        res.status(200).json({
            success: true,
            summary: {
                totalProducts,
                totalStockQuantity,
                totalStockValuation: parseFloat(totalStockValuation.toFixed(2))
            },
            data: detailedValuation
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// Low-Stock Report
// ==========================================
const getLowStockReport = async (req, res) => {
    try {
        const products = await Product.find({
            $expr: {
                $lte: ["$availableQuantity", "$reorderLevel"]
            }
        }).sort({ productName: 1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// Supplier Purchase History Report
// ==========================================
const getSupplierPurchaseHistoryReport = async (req, res) => {
    try {
        const purchases = await StockMovement.find({ type: "IN" })
            .populate("product", "productName sku category unitPrice")
            .populate("supplier", "supplierName contactPerson email mobileNumber")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: purchases.length,
            data: purchases
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// General Stock Report (Movements Ledger)
// ==========================================
const getStockReport = async (req, res) => {
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
    getSalesReport,
    getInventoryReport,
    getLowStockReport,
    getSupplierPurchaseHistoryReport,
    getStockReport
};