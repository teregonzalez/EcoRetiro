import express from 'express';
import { dbRun, dbGet } from '../models/database.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = await dbGet(
      'SELECT id, username FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    console.log('Login attempt:', { username, password });
    console.log('Query result:', user);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ success: true, userId: user.id, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    await dbRun('INSERT INTO users (username, password) VALUES (?, ?)', [
      username,
      password,
    ]);

    res.json({ success: true });
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'User already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
