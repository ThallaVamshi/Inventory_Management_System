const { body } = require("express-validator");

const orderValidationRules = [

    body("customerName")
        .notEmpty()
        .withMessage("Customer name is required"),

    body("customerEmail")
        .optional({ checkFalsy: true })
        .isEmail()
        .withMessage("Enter a valid email"),

    body("customerPhone")
        .optional({ checkFalsy: true })
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone number must be 10 digits"),

    body("expectedDeliveryDate")
        .notEmpty()
        .withMessage("Expected delivery date is required")
        .isISO8601()
        .withMessage("Invalid expected delivery date"),

    body("items")
        .isArray({ min: 1 })
        .withMessage("At least one product item is required"),

    body("items.*.product")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid Product ID"),

    body("items.*.quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive integer"),

    body("items.*.discount")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("Discount must be between 0 and 100 percent")

];

module.exports = orderValidationRules;