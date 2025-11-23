import { Router } from 'express';
import pool from '../database.js';

const router = Router();

/* GET all textbooks */
router.get('/', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM textbooks ORDER BY created_at DESC');
        connection.release();

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching textbooks:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching textbooks',
            error: error.message
        });
    }
});

/* GET single textbook by ID */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM textbooks WHERE id = ?', [id]);
        connection.release();

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Textbook not found'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching textbook:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching textbook',
            error: error.message
        });
    }
});

/* POST create new textbook */
router.post('/', async (req, res) => {
    try {
        const { title, subject, course_number, condition_status, price, seller_contact, description, image_url } = req.body;

        if (!title || !price || !seller_contact) {
            return res.status(400).json({
                success: false,
                message: 'Title, price, and seller contact are required'
            });
        }

        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO textbooks (title, subject, course_number, condition_status, price, seller_contact, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, subject, course_number, condition_status, price, seller_contact, description, image_url]
        );
        connection.release();

        res.status(201).json({
            success: true,
            message: 'Textbook listed successfully',
            data: {
                id: result.insertId,
                title, subject, course_number, condition_status, price, seller_contact, description, image_url
            }
        });
    } catch (error) {
        console.error('Error creating textbook:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating textbook',
            error: error.message
        });
    }
});

export default router;
