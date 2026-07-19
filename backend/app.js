const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();

// ==========================================
// Middleware
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Swagger Configuration
// ==========================================
const { swaggerUi, swaggerSpec } = require("./config/swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==========================================
// Routes
// ==========================================
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const stockRoutes = require("./routes/stockRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");

// ==========================================
// API Routes
// ==========================================
app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/suppliers", supplierRoutes);

app.use("/api/stock", stockRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/reports", reportRoutes);

// ==========================================
// Static Files & Health Check
// ==========================================
const frontendDistPath = path.join(__dirname, "../frontend/dist/frontend/browser");

if (fs.existsSync(frontendDistPath)) {
    // Serve static frontend files
    app.use(express.static(frontendDistPath));
    
    // Client-side routing fallback
    app.get("/{*any}", (req, res, next) => {
        if (req.path.startsWith("/api")) {
            return next();
        }
        res.sendFile(path.join(frontendDistPath, "index.html"));
    });
} else {
    // Health Check Route (development/fallback)
    app.get("/", (req, res) => {
        res.status(200).json({
            success: true,
            message: "Inventory Management System API is Running Successfully 🚀"
        });
    });

    // 404 Route
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: "Route not found"
        });
    });
}


// ==========================================
// Global Error Handler
// ==========================================
const errorHandler = require("./middleware/errorMiddleware");

app.use(errorHandler);

// ==========================================
// Export App
// ==========================================
module.exports = app;