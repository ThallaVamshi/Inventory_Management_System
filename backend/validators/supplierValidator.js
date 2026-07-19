const { body } = require("express-validator");

const supplierValidationRules = [

    body("supplierName")
        .trim()
        .notEmpty()
        .withMessage("Supplier Name is required"),

    body("contactPerson")
        .trim()
        .notEmpty()
        .withMessage("Contact Person is required"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Valid Email is required")
        .normalizeEmail(),

    body("mobileNumber")
        .trim()
        .notEmpty()
        .withMessage("Mobile Number is required")
        .isLength({ min: 10, max: 10 })
        .withMessage("Mobile Number must be 10 digits"),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required"),

    body("gstNumber")
        .trim()
        .notEmpty()
        .withMessage("GST Number is required")

];

module.exports = supplierValidationRules;