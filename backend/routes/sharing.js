const express = require('express');
const router = require('express').Router();
const crypto = require('crypto');
const db = require('../config/db');
const auth = require('../middleware/auth');
const logActivity = require('../utils/activityLogger');
const path = require('path');
const fs = require('fs-extra');

const STORAGE_PATH = process.env.STORAGE_PATH || '/home/sakshi/apnacloud-storage';


// Generate Secure Share Link
router.post('/', auth, (req, res) => {
  const { fileId, expiryHours } = req.body;
  if (!fileId) return res.status(400).json({ error: 'File ID is required' });

  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + (expiryHours || 24));

  try {
    const stmt = db.prepare('INSERT INTO shares (file_id, token, expires_at) VALUES (?, ?, ?)');
    stmt.run(fileId, token, expiry.toISOString());

    logActivity(req.user.id, 'SHARE_CREATE', `Generated share link for file ID: ${fileId}`);
    res.json({ token, expires_at: expiry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Access Shared File (Download)
router.get('/:token', async (req, res) => {
  const { token } = req.params;
  const share = db.prepare('SELECT * FROM shares WHERE token = ?').get(token);

  if (!share || new Date(share.expires_at) < new Date()) {
    return res.status(404).json({ error: 'Invalid or expired link' });
  }

  const file = db.prepare('SELECT * FROM files WHERE id = ?').get(share.file_id);
  if (!file) return res.status(404).json({ error: 'File no longer exists' });

  const fullPath = path.join(STORAGE_PATH, file.path);
  if (await fs.exists(fullPath)) {
    res.download(fullPath, file.name);
  } else {
    res.status(404).json({ error: 'File not found on disk' });
  }
});

// Get Share Info (Public)
router.get('/info/:token', async (req, res) => {
  const { token } = req.params;
  const share = db.prepare('SELECT * FROM shares WHERE token = ?').get(token);

  if (!share || new Date(share.expires_at) < new Date()) {
    return res.status(404).json({ error: 'Invalid or expired link' });
  }

  const file = db.prepare('SELECT name, size, type FROM files WHERE id = ?').get(share.file_id);
  if (!file) return res.status(404).json({ error: 'File no longer exists' });

  res.json({ ...file, expires_at: share.expires_at });
});

// List all active shares for user
router.get('/', auth, (req, res) => {
  try {
    const shares = db.prepare(`
      SELECT shares.*, files.name as file_name 
      FROM shares 
      JOIN files ON shares.file_id = files.id 
      WHERE files.owner_id = ?
    `).all(req.user.id);
    res.json(shares);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Revoke Share
router.delete('/:id', auth, (req, res) => {
  try {
    const share = db.prepare('SELECT * FROM shares WHERE id = ?').get(req.params.id);
    if (!share) return res.status(404).json({ error: 'Share not found' });
    
    const file = db.prepare('SELECT owner_id FROM files WHERE id = ?').get(share.file_id);
    if (file.owner_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    db.prepare('DELETE FROM shares WHERE id = ?').run(req.params.id);
    logActivity(req.user.id, 'SHARE_REVOKE', `Revoked share for file ID: ${share.file_id}`);
    res.json({ message: 'Share revoked successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
