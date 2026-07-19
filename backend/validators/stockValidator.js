const { body } = require("express-validator");

const stockValidationRules = [

    body("product")
        .notEmpty()
        .withMessage("Product ID is required"),

    body("quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be greater than 0"),

    body("remarks")
        .optional()
        .trim(),

    body("supplier")
        .optional()
        .trim()

];

module.exports = stockValidationRules;