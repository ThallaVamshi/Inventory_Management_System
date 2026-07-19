const express = require("express");
const router = express.Router();

const {
    getDashboardSummary
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard APIs
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Dashboard Summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary fetched successfully
 */
router.get(
    "/",
    protect,
    authorize("admin"),
    getDashboardSummary
);

module.exports = router;