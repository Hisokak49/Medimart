import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import productRouter from './routes/productRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import authRouter from './routes/authRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// Initialize Database connection
await connectDB();

// Global Middlewares
app.use(express.json());
app.use(cors());

// Log incoming HTTP requests for visibility
app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    next();
});

// Clerk Middleware to parse JWT tokens and set req.auth()
app.use(clerkMiddleware());

// API Routes
app.get('/', (req, res) => res.send('MediMart API Server is Live!'));

// Lightweight health endpoint for deployment/load-balancer checks
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'medimart-api',
        timestamp: new Date().toISOString()
    });
});

// Inngest Webhook & Functions Route
app.use('/api/inngest', serve({ client: inngest, functions }));

// Telemetry endpoint to log frontend errors to backend console
app.post('/api/log-error', (req, res) => {
    console.log('\n[FRONTEND ERROR]', req.body);
    res.json({ success: true });
});

// Domain Routers
app.use('/api/auth', authRouter);
app.use('/api/medicines', productRouter);
app.use('/api/orders', orderRouter);

// Start server
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => console.log(`MediMart Server listening at http://localhost:${port}`));
}

export default app;