import express from 'express';
import { dbRun, dbGet, dbAll } from '../models/database.js';

const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const { userId, type, weight } = req.body;

    if (!userId || !type || !weight) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const date = new Date().toISOString();
    await dbRun(
      'INSERT INTO waste_entries (userId, type, weight, date) VALUES (?, ?, ?, ?)',
      [userId, type, weight, date]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/inventory', async (req, res) => {
  try {
    const entries = await dbAll(
      `SELECT type, SUM(weight) as totalWeight, COUNT(*) as count 
       FROM waste_entries 
       GROUP BY type`
    );

    res.json(entries || []);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const entries = await dbAll(
      `SELECT id, type, weight, date FROM waste_entries 
       WHERE userId = ? 
       ORDER BY date DESC`,
      [userId]
    );

    res.json(entries || []);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
