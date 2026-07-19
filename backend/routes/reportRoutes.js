const express = require("express");
const router = express.Router();

const {
    getSalesReport,
    getInventoryReport,
    getLowStockReport,
    getSupplierPurchaseHistoryReport,
    getStockReport
} = require("../controllers/reportController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Reports APIs
 */

/**
 * @swagger
 * /api/reports/sales:
 *   get:
 *     summary: Get Sales Report (Monthly Sales)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales report fetched successfully
 */
router.get(
    "/sales",
    protect,
    authorize("admin"),
    getSalesReport
);

/**
 * @swagger
 * /api/reports/inventory:
 *   get:
 *     summary: Get Inventory Report (Stock Valuation)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory report fetched successfully
 */
router.get(
    "/inventory",
    protect,
    authorize("admin"),
    getInventoryReport
);

/**
 * @swagger
 * /api/reports/low-stock:
 *   get:
 *     summary: Get Low-Stock Report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Low-stock report fetched successfully
 */
router.get(
    "/low-stock",
    protect,
    authorize("admin"),
    getLowStockReport
);

/**
 * @swagger
 * /api/reports/purchases:
 *   get:
 *     summary: Get Supplier Purchase History Report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Supplier purchases report fetched successfully
 */
router.get(
    "/purchases",
    protect,
    authorize("admin"),
    getSupplierPurchaseHistoryReport
);

/**
 * @swagger
 * /api/reports/stock:
 *   get:
 *     summary: Get Stock Report (Movements Ledger)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stock report fetched successfully
 */
router.get(
    "/stock",
    protect,
    authorize("admin"),
    getStockReport
);

module.exports = router;