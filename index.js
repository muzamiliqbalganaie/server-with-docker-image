require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const { errorHandler } = require('./middleware/errorHandler');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const BLESS_PORT = process.env.BLESS_PORT || 9527;

// Security & Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Bless Container API v2.0',
        environment: NODE_ENV,
        version: '2.0.0',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login'
            },
            users: {
                list: 'GET /api/users',
                me: 'GET /api/users/me',
                byId: 'GET /api/users/:id'
            },
            tasks: {
                list: 'GET /api/tasks',
                create: 'POST /api/tasks',
                update: 'PUT /api/tasks/:id',
                delete: 'DELETE /api/tasks/:id'
            }
        },
        ports: {
            http: PORT,
            bless: BLESS_PORT
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString(),
        environment: NODE_ENV
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
initDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log('=================================');
            console.log(`🚀 Bless Container Server v2.0`);
            console.log(`📡 Environment: ${NODE_ENV}`);
            console.log(`🌐 HTTP Port: ${PORT}`);
            console.log(`🔗 Bless Port: ${BLESS_PORT}`);
            console.log(`💾 Database: SQLite (initialized)`);
            console.log(`🔒 Security: Helmet + CORS enabled`);
            console.log(`🕒 Started: ${new Date().toISOString()}`);
            console.log('=================================');
        });
    })
    .catch(err => {
        console.error('❌ Failed to initialize database:', err);
        process.exit(1);
    });

module.exports = app;
