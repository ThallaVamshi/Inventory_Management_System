const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// ==========================================
// CORS Configuration
// ==========================================

const allowedOrigins = [
    "http://localhost:4200",
    "https://inventory-management-system.vercel.app",
    "https://inventory-management-system-b9tb.onrender.com",
    process.env.FRONTEND_URL
].filter(Boolean);

const corsOptionsDelegate = function (req, callback) {
    const origin = req.header('Origin');
    const host = req.get('host');

    const isAllowed = !origin || 
                      allowedOrigins.includes(origin) || 
                      (host && origin.includes(host));

    if (isAllowed) {
        callback(null, {
            origin: true,
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"]
        });
    } else {
        callback(null, { origin: false });
    }
};

app.use(cors(corsOptionsDelegate));

// ==========================================
// Middleware
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Swagger
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

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);

// ==========================================
// Static Frontend
// ==========================================

const frontendDistPath = path.join(
    __dirname,
    "../frontend/dist/frontend/browser"
);

if (fs.existsSync(frontendDistPath)) {

    app.use(express.static(frontendDistPath));

    // Serve Angular app for all non-API routes
    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path.join(frontendDistPath, "index.html"));
    });

} else {

    app.get("/", (req, res) => {
        res.status(200).json({
            success: true,
            message: "Inventory Management System API is Running Successfully 🚀"
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: "Route not found"
        });
    });

}

// ==========================================
// Error Handler
// ==========================================

const errorHandler = require("./middleware/errorMiddleware");

app.use(errorHandler);

// ==========================================
// Export
// ==========================================

module.exports = app;