const { body } = require("express-validator");

const productValidationRules = [
    body("productName")
        .notEmpty()
        .withMessage("Product name is required"),

    body("sku")
        .notEmpty()
        .withMessage("SKU is required"),

    body("category")
        .notEmpty()
        .withMessage("Category is required"),

    body("unitPrice")
        .isFloat({ min: 0 })
        .withMessage("Unit price must be greater than or equal to 0"),

    body("unitOfMeasure")
        .notEmpty()
        .withMessage("Unit of Measure is required"),

    body("reorderLevel")
        .isInt({ min: 0 })
        .withMessage("Reorder level cannot be negative"),

    body("description")
        .optional()
        .trim()
];

module.exports = productValidationRules;