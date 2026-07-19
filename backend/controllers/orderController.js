const Order = require("../models/Order");
const Product = ../models/product;
const StockMovement = require("../models/StockMovement");

// ==========================================
// Create Order
// ==========================================
const createOrder = async (req, res) => {
    try {
        const {
            customerName,
            customerEmail,
            customerPhone,
            expectedDeliveryDate,
            items // Array of { product, quantity, discount }
        } = req.body;

        const resolvedItems = [];
        let subtotal = 0;
        let discountAmount = 0;

        // Verify all products exist and have sufficient stock
        for (const item of items) {
            const dbProduct = await Product.findById(item.product);
            if (!dbProduct) {
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${item.product} not found`
                });
            }

            if (dbProduct.availableQuantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product: ${dbProduct.productName}`
                });
            }

            const itemSubtotal = dbProduct.unitPrice * item.quantity;
            const itemDiscount = ((item.discount || 0) / 100) * itemSubtotal;

            resolvedItems.push({
                product: item.product,
                quantity: item.quantity,
                unitPrice: dbProduct.unitPrice,
                discount: item.discount || 0
            });

            subtotal += itemSubtotal;
            discountAmount += itemDiscount;
        }

        const taxableAmount = subtotal - discountAmount;
        const taxAmount = parseFloat((taxableAmount * 0.18).toFixed(2)); // 18% Tax Rate
        const grandTotal = parseFloat((taxableAmount + taxAmount).toFixed(2));

        // Create Order
        const order = await Order.create({
            customerName,
            customerEmail,
            customerPhone,
            expectedDeliveryDate,
            items: resolvedItems,
            subtotal,
            discountAmount,
            taxAmount,
            grandTotal,
            status: "Pending"
        });

        // Deduct quantities and write stock movement OUT for each item
        for (const item of resolvedItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { availableQuantity: -item.quantity }
            });

            await StockMovement.create({
                product: item.product,
                quantity: item.quantity,
                remarks: `Order Placed: ${order.orderNumber}`,
                type: "OUT"
            });
        }

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// Get All Orders
// ==========================================
const getOrders = async (req, res) => {
    try {
        const search = req.query.search || "";
        const status = req.query.status || "";
        const sort = req.query.sort || "-createdAt";

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {};

        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: "i" } },
                { customerName: { $regex: search, $options: "i" } }
            ];
        }

        if (status) {
            query.status = status;
        }

        // Sort mappings
        let sortOption = {};
        if (sort === "amount" || sort === "grandTotal") {
            sortOption = { grandTotal: 1 };
        } else if (sort === "-amount" || sort === "-grandTotal") {
            sortOption = { grandTotal: -1 };
        } else if (sort === "orderDate" || sort === "createdAt") {
            sortOption = { createdAt: 1 };
        } else if (sort === "-orderDate" || sort === "-createdAt") {
            sortOption = { createdAt: -1 };
        } else {
            sortOption = { [sort.replace("-", "")]: sort.startsWith("-") ? -1 : 1 };
        }

        const totalOrders = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .populate("items.product", "productName sku category")
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            page,
            limit,
            totalOrders,
            totalPages: Math.ceil(totalOrders / limit),
            count: orders.length,
            data: orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// Get Order By ID
// ==========================================
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("items.product", "productName sku category unitPrice");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// Update Order Status
// ==========================================
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const previousStatus = order.status;

        // If status changed to Cancelled, restore the items' quantities
        if (status === "Cancelled" && previousStatus !== "Cancelled") {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { availableQuantity: item.quantity }
                });

                await StockMovement.create({
                    product: item.product,
                    quantity: item.quantity,
                    remarks: `Restocked - Cancelled Order: ${order.orderNumber}`,
                    type: "IN"
                });
            }
        }
        // If status is changed FROM Cancelled back to active, deduct stock again
        else if (previousStatus === "Cancelled" && status !== "Cancelled") {
            // Verify stock first
            for (const item of order.items) {
                const dbProduct = await Product.findById(item.product);
                if (dbProduct.availableQuantity < item.quantity) {
                    return res.status(400).json({
                        success: false,
                        message: `Insufficient stock to re-activate order for product: ${dbProduct.productName}`
                    });
                }
            }

            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { availableQuantity: -item.quantity }
                });

                await StockMovement.create({
                    product: item.product,
                    quantity: item.quantity,
                    remarks: `Re-deducted - Restored Order: ${order.orderNumber}`,
                    type: "OUT"
                });
            }
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// Delete Order
// ==========================================
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Restock quantities if deleting an active (not cancelled) order
        if (order.status !== "Cancelled") {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { availableQuantity: item.quantity }
                });

                await StockMovement.create({
                    product: item.product,
                    quantity: item.quantity,
                    remarks: `Restocked - Deleted Order: ${order.orderNumber}`,
                    type: "IN"
                });
            }
        }

        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
};