const express = require('express');
const authMiddleware = require('../middleware/auth');
const { db } = require('../config/database');

const router = express.Router();

// Get all users (protected)
router.get('/', authMiddleware, (req, res) => {
    db.all('SELECT id, username, email, role, created_at FROM users', [], (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({
            count: users.length,
            users
        });
    });
});

// Get current user profile
router.get('/me', authMiddleware, (req, res) => {
    db.get(
        'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
        [req.user.id],
        (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ user });
        }
    );
});

// Get user by ID (protected)
router.get('/:id', authMiddleware, (req, res) => {
    db.get(
        'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
        [req.params.id],
        (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ user });
        }
    );
});

module.exports = router;
