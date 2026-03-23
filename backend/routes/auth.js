const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const logActivity = require('../utils/activityLogger');
const auth = require('../middleware/auth');
require('dotenv').config();

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
  logActivity(user.id, 'LOGIN', 'User logged in');
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

// Logout
router.post('/logout', auth, (req, res) => {
  logActivity(req.user.id, 'LOGOUT', 'User logged out');
  res.json({ message: 'Logged out successfully' });
});

// Admin Create User (Protected)
router.post('/admin/create-user', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Only admins can create users' });
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
    stmt.run(email, hashedPassword, role || 'user');
    logActivity(req.user.id, 'USER_CREATE', `Created user: ${email}`);
    res.json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ error: 'User already exists' });
  }
});

// Admin List Users
router.get('/admin/users', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  const users = db.prepare('SELECT id, email, role, created_at FROM users').all();
  res.json(users);
});

// Admin Delete User
router.delete('/admin/users/:id', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  const { id } = req.params;
  const userToDelete = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!userToDelete) return res.status(404).json({ error: 'User not found' });
  if (userToDelete.id === req.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });

  try {
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    logActivity(req.user.id, 'USER_DELETE', `Deleted user: ${userToDelete.email}`);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
