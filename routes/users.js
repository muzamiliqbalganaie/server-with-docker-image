const express = require('express');
const authMiddleware = require('../middleware/auth');
const { pool } = require('../config/database');

const router = express.Router();

// Get all users (protected)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, username, email, role, created_at FROM users');
        res.json({ count: users.length, users });
    } catch (error) {
        console.error('Users list error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
            [req.user.id]
        );
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get user by ID (protected)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
            [req.params.id]
        );
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('User fetch error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
