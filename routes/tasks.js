const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const { pool } = require('../config/database');

const router = express.Router();

// Get all tasks for logged-in user
router.get('/', authMiddleware, async (req, res) => {
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

    try {
        const [tasks] = await pool.query(query, params);
        res.json({ count: tasks.length, tasks });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get single task by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        const task = rows[0];

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ task });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Create new task
router.post('/', [
    authMiddleware,
    body('title').notEmpty().trim().withMessage('Title is required'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO tasks (user_id, title, description, priority) VALUES (?, ?, ?, ?)',
            [req.user.id, title, description || '', priority || 'medium']
        );

        res.status(201).json({
            message: 'Task created successfully',
            task: {
                id: result.insertId,
                title,
                description: description || '',
                priority: priority || 'medium',
                status: 'pending'
            }
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Update task
router.put('/:id', [
    authMiddleware,
    body('status').optional().isIn(['pending', 'in-progress', 'completed', 'cancelled']),
    body('priority').optional().isIn(['low', 'medium', 'high'])
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status, priority } = req.body;

    try {
        const [result] = await pool.query(
            `UPDATE tasks SET 
                title = COALESCE(?, title), 
                description = COALESCE(?, description),
                status = COALESCE(?, status), 
                priority = COALESCE(?, priority), 
                updated_at = NOW() 
             WHERE id = ? AND user_id = ?`,
            [title, description, status, priority, req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ error: 'Update failed' });
    }
});

// Delete task
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM tasks WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ error: 'Delete failed' });
    }
});

module.exports = router;
