const { body } = require("express-validator");

const authValidationRules = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Valid email is required")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("role")
        .optional()
        .isIn(["admin", "staff"])
        .withMessage("Role must be either admin or staff")
];

module.exports = authValidationRules;