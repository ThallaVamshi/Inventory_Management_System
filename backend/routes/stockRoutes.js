const express = require("express");
const router = express.Router();

const {
    stockIn,
    stockOut,
    getStockHistory
} = require("../controllers/stockController");

const stockValidationRules = require("../validators/stockValidator");
const validate = require("../middleware/validate");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Stock
 *   description: Stock Management APIs
 */

/**
 * @swagger
 * /api/stock/stock-in:
 *   post:
 *     summary: Add Stock
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Stock added successfully
 */
router.post(
    "/stock-in",
    protect,
    authorize("admin", "staff"),
    stockValidationRules,
    validate,
    stockIn
);

/**
 * @swagger
 * /api/stock/stock-out:
 *   post:
 *     summary: Remove Stock
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Stock removed successfully
 */
router.post(
    "/stock-out",
    protect,
    authorize("admin", "staff"),
    stockValidationRules,
    validate,
    stockOut
);

/**
 * @swagger
 * /api/stock/history:
 *   get:
 *     summary: Get Stock Movement History
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stock history fetched successfully
 */
router.get(
    "/history",
    protect,
    authorize("admin", "staff"),
    getStockHistory
);

module.exports = router;