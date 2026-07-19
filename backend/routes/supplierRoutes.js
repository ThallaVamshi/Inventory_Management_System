const express = require("express");
const router = express.Router();

const {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
} = require("../controllers/supplierController");

const supplierValidationRules = require("../validators/supplierValidator");
const validate = require("../middleware/validate");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: Supplier Management APIs
 */

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: Suppliers retrieved successfully
 */
router.get("/", protect, getSuppliers);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get supplier by ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Supplier retrieved successfully
 *       404:
 *         description: Supplier not found
 */
router.get("/:id", protect, getSupplierById);

/**
 * @swagger
 * /api/suppliers:
 *   post:
 *     summary: Create a new supplier
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Supplier created successfully
 */
router.post(
    "/",
    protect,
    authorize("admin"),
    supplierValidationRules,
    validate,
    createSupplier
);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   put:
 *     summary: Update supplier
 *     tags: [Suppliers]
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
 *         description: Supplier updated successfully
 */
router.put(
    "/:id",
    protect,
    authorize("admin"),
    supplierValidationRules,
    validate,
    updateSupplier
);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   delete:
 *     summary: Delete supplier
 *     tags: [Suppliers]
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
 *         description: Supplier deleted successfully
 */
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteSupplier
);

module.exports = router;