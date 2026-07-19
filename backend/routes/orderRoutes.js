const express = require("express");
const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} = require("../controllers/orderController");

const orderValidationRules = require("../validators/orderValidator");
const validate = require("../middleware/validate");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order Management APIs
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create Order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post(
    "/",
    protect,
    authorize("admin", "staff"),
    orderValidationRules,
    validate,
    createOrder
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get All Orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 */
router.get(
    "/",
    protect,
    authorize("admin", "staff"),
    getOrders
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get Order By ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order fetched successfully
 */
router.get(
    "/:id",
    protect,
    authorize("admin", "staff"),
    getOrderById
);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update Order Status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order updated successfully
 */
router.put(
    "/:id",
    protect,
    authorize("admin", "staff"),
    updateOrderStatus
);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete Order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 */
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteOrder
);

module.exports = router;