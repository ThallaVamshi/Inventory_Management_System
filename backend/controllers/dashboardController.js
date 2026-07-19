const Product = require("../models/product");
const Supplier = require("../models/Supplier");
const Order = require("../models/Order");

// ==========================================
// Dashboard Summary
// ==========================================
const getDashboardSummary = async (req, res) => {
    try {

        // Total Counts
        const totalProducts = await Product.countDocuments();
        const totalSuppliers = await Supplier.countDocuments();
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: "Pending" });

        // Revenue (Excluding Cancelled Orders is best, but let's sum all active orders. Usually Cancelled orders shouldn't count towards revenue, so let's exclude status: Cancelled)
        const revenueResult = await Order.aggregate([
            {
                $match: { status: { $ne: "Cancelled" } }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$grandTotal" }
                }
            }
        ]);

        const totalRevenue =
            revenueResult.length > 0
                ? parseFloat(revenueResult[0].totalRevenue.toFixed(2))
                : 0;

        // Low Stock Products
        const lowStockProducts = await Product.countDocuments({
            $expr: {
                $lte: ["$availableQuantity", "$reorderLevel"]
            }
        });

        // Latest Orders
        const recentOrders = await Order.find()
            .populate("items.product", "productName sku")
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                totalSuppliers,
                totalOrders,
                totalRevenue,
                lowStockProducts,
                pendingOrders,
                recentOrders
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getDashboardSummary
};