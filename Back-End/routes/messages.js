import { Router } from 'express';
import pool from '../database.js';

const router = Router();

// Send a message
router.post('/', async (req, res) => {
    const { sender_id, receiver_id, textbook_id, content } = req.body;

    if (!sender_id || !receiver_id || !content) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        const connection = await pool.getConnection();
        await connection.execute(
            'INSERT INTO messages (sender_id, receiver_id, textbook_id, content) VALUES (?, ?, ?, ?)',
            [sender_id, receiver_id, textbook_id || null, content]
        );
        connection.release();
        res.status(201).json({ success: true, message: 'Message sent' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Error sending message' });
    }
});

// Get conversations for a user (list of people they've talked to)
router.get('/conversations/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const connection = await pool.getConnection();
        // Complex query to get the last message and other user's info for each conversation
        const [rows] = await connection.execute(`
      SELECT 
        u.id AS other_user_id,
        u.name AS other_user_name,
        m.content AS last_message,
        m.created_at,
        m.is_read,
        m.sender_id
      FROM messages m
      JOIN users u ON (m.sender_id = u.id OR m.receiver_id = u.id)
      WHERE (m.sender_id = ? OR m.receiver_id = ?) AND u.id != ?
      AND m.id IN (
        SELECT MAX(id) FROM messages 
        WHERE (sender_id = ? OR receiver_id = ?) 
        GROUP BY CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END
      )
      ORDER BY m.created_at DESC
    `, [userId, userId, userId, userId, userId, userId]);

        connection.release();
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ success: false, message: 'Error fetching conversations' });
    }
});

// Get messages between two users
router.get('/:userId/:otherUserId', async (req, res) => {
    const { userId, otherUserId } = req.params;
    try {
        const connection = await pool.getConnection();

        // Mark messages as read
        await connection.execute(
            'UPDATE messages SET is_read = TRUE WHERE receiver_id = ? AND sender_id = ?',
            [userId, otherUserId]
        );

        const [rows] = await connection.execute(`
      SELECT * FROM messages 
      WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
    `, [userId, otherUserId, otherUserId, userId]);

        connection.release();
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Error fetching messages' });
    }
});

// Get unread count
router.get('/unread/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = FALSE',
            [userId]
        );
        connection.release();
        res.json({ success: true, count: rows[0].count });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ success: false, message: 'Error fetching unread count' });
    }
});

export default router;
