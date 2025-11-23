import { Router } from 'express';
import pool from '../database.js';

const router = Router();

/* GET all posts */
router.get('/', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM posts ORDER BY created_at DESC');
        connection.release();

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching posts',
            error: error.message
        });
    }
});

/* POST create new post */
router.post('/', async (req, res) => {
    const { content, author_name, category } = req.body;
    if (!content) {
        return res.status(400).json({ success: false, message: 'Content is required' });
    }

    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO posts (content, author_name, category) VALUES (?, ?, ?)',
            [content, author_name || 'Anonymous', category || 'General']
        );
        connection.release();

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: {
                id: result.insertId,
                content,
                author_name: author_name || 'Anonymous',
                category: category || 'General'
            }
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ success: false, message: 'Error creating post' });
    }
});

export default router;
