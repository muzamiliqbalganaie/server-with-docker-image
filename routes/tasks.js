const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const { db } = require('../config/database');

const router = express.Router();

// Get all tasks for logged-in user
router.get('/', authMiddleware, (req, res) => {
    const { status, priority } = req.query;
    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [req.user.id];

    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }
    if (priority) {
        query += ' AND priority = ?';
        params.push(priority);
    }

    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, tasks) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({
            count: tasks.length,
            tasks
        });
    });
});

// Get single task by ID
router.get('/:id', authMiddleware, (req, res) => {
    db.get(
        'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
        [req.params.id, req.user.id],
        (err, task) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json({ task });
        }
    );
});

// Create new task
router.post('/', [
    authMiddleware,
    body('title').notEmpty().trim().withMessage('Title is required'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority } = req.body;

    db.run(
        'INSERT INTO tasks (user_id, title, description, priority) VALUES (?, ?, ?, ?)',
        [req.user.id, title, description || '', priority || 'medium'],
        function (err) {
            if (err) {
                console.error('Create task error:', err);
                return res.status(500).json({ error: 'Failed to create task' });
            }
            res.status(201).json({
                message: 'Task created successfully',
                task: {
                    id: this.lastID,
                    title,
                    description: description || '',
                    priority: priority || 'medium',
                    status: 'pending'
                }
            });
        }
    );
});

// Update task
router.put('/:id', [
    authMiddleware,
    body('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']),
    body('priority').optional().isIn(['low', 'medium', 'high'])
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status, priority } = req.body;

    db.run(
        `UPDATE tasks SET 
            title = COALESCE(?, title), 
            description = COALESCE(?, description),
            status = COALESCE(?, status), 
            priority = COALESCE(?, priority), 
            updated_at = CURRENT_TIMESTAMP 
         WHERE id = ? AND user_id = ?`,
        [title, description, status, priority, req.params.id, req.user.id],
        function (err) {
            if (err) {
                console.error('Update task error:', err);
                return res.status(500).json({ error: 'Update failed' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json({ message: 'Task updated successfully' });
        }
    );
});

// Delete task
router.delete('/:id', authMiddleware, (req, res) => {
    db.run(
        'DELETE FROM tasks WHERE id = ? AND user_id = ?',
        [req.params.id, req.user.id],
        function (err) {
            if (err) {
                console.error('Delete task error:', err);
                return res.status(500).json({ error: 'Delete failed' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json({ message: 'Task deleted successfully' });
        }
    );
});

module.exports = router;
