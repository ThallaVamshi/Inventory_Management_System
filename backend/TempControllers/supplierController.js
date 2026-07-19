const Supplier = require("../models/Supplier");

// Create Supplier
const createSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.create(req.body);

        res.status(201).json({
            success: true,
            message: "Supplier created successfully",
            data: supplier
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Suppliers
const getSuppliers = async (req, res) => {
    try {
        const {
            search = "",
            page = 1,
            limit = 10
        } = req.query;

        const query = {
            $or: [
                { supplierName: { $regex: search, $options: "i" } },
                { contactPerson: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ]
        };

        const suppliers = await Supplier.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await Supplier.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            data: suppliers
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Get Supplier By ID
const getSupplierById = async (req, res) => {
    try {

        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            });
        }

        res.status(200).json({
            success: true,
            data: supplier
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Update Supplier
const updateSupplier = async (req, res) => {
    try {

        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Supplier updated successfully",
            data: supplier
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Delete Supplier
const deleteSupplier = async (req, res) => {
    try {

        const supplier = await Supplier.findByIdAndDelete(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Supplier deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
};