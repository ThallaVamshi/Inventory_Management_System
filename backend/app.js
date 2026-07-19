const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();

// ==========================================
// CORS Configuration
// ==========================================

const allowedOrigins = [
    "http://localhost:4200",
    "https://your-vercel-app.vercel.app" // Replace with your Vercel URL
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (Postman, Swagger, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests
app.options("*", cors());

// ==========================================
// Middleware
// ==========================================

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
// Static Files
// ==========================================

const frontendDistPath = path.join(
    __dirname,
    "../frontend/dist/frontend/browser"
);

if (fs.existsSync(frontendDistPath)) {

    app.use(express.static(frontendDistPath));

    app.get("/{*any}", (req, res, next) => {
        if (req.path.startsWith("/api")) {
            return next();
        }

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
// Global Error Handler
// ==========================================

const errorHandler = require("./middleware/errorMiddleware");

app.use(errorHandler);

// ==========================================
// Export
// ==========================================

module.exports = app;