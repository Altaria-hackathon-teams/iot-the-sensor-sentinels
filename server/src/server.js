const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const connectDB = require('./config/database');
const { createProxyMiddleware } = require('http-proxy-middleware');
// --- Import WebSocket Service ---
const { initWebSocket, broadcast } = require('./services/socket-handler'); // ⬅️ NEW
// --- Import Routes ---
const authRoutes = require('./routes/auth');
const marketplaceRoutes = require('./routes/marketplace');
const farmersHubRoutes = require('./routes/farmersHub');
const sensorRoutes = require('./routes/sensors');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 4000;

// Wrap in an async function to allow top-level await for DB connection
async function startServer() {
    // --- Connect to Database ---
    // This now waits for the connection to be established before proceeding
    await connectDB();

    // --- Core Middleware ---

    // 1. CORS (Cross-Origin Resource Sharing)
    // Needs to be configured to allow credentials (cookies) from your Next.js frontend
    app.use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }));

    // 2. Body Parsers
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // 3. Express Session
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
            collectionName: 'sessions'
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            secure: process.env.NODE_ENV === 'production', // Send cookie over HTTPS only in production
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            sameSite: 'lax' // 'lax' is standard for most browsers
        }
    }));

    // 4. Passport Authentication
    require('./config/passport'); // Configure Passport strategies
    app.use(passport.initialize());
    app.use(passport.session());

    // --- API Routes ---

    // Authentication routes
    app.use('/api/auth', authRoutes);

    // Protected routes (Marketplace, Farmer's Hub)
    app.use('/api/marketplace', marketplaceRoutes);
    app.use('/api/farmers-hub', farmersHubRoutes);
    app.use('/api/sensors', sensorRoutes);
    app.use('/api/ai', aiRoutes);

    // --- AI Service Proxy Routes (Future Implementation) ---
    // Example of how you would proxy to your Python AI services

    // Proxy for YOLOv8 Diagnostic Service (running on port 5001)
    app.use('/api/diag', createProxyMiddleware({
        target: 'http://localhost:5001',
        changeOrigin: true,
        pathRewrite: { '^/api/diag': '/' }, // Rewrites /api/diag to /
    }));

    // Proxy for Random Forest Environment Service (running on port 5002)
    app.use('/api/env', createProxyMiddleware({
        target: 'http://localhost:5002',
        changeOrigin: true,
        pathRewrite: { '^/api/env': '/' }, // Rewrites /api/env to /
    }));

    // --- WebSocket Server (To be implemented) ---
    // The WebSocket server (using 'ws') would be initialized and attached
    // to the same server instance for real-time IoT data.

    // --- Start Server ---
    const httpServer = http.createServer(app);
    
    // Initialize WebSocket with the HTTP server
    initWebSocket(httpServer);

    httpServer.listen(PORT, () => {
        console.log(`🚀 Gateway Server running on port ${PORT}`);
        console.log(`🔌 Accepting requests from: ${process.env.CORS_ORIGIN}`);
    });
}

startServer().catch(err => {
    console.error("Failed to start server:", err);
    process.exit(1);
});