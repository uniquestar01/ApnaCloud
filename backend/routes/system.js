const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const checkDiskSpace = require('check-disk-space').default;
const si = require('systeminformation');
const path = require('path');
const fs = require('fs-extra');

const STORAGE_PATH = process.env.STORAGE_PATH || path.join(__dirname, '../storage');

// Get Full System Stats
router.get('/stats', auth, async (req, res) => {
  try {
    const memory = await si.mem();
    const cpu = await si.currentLoad();
    const temp = await si.cpuTemperature();
    const diskSpace = await checkDiskSpace(STORAGE_PATH);

    res.json({
        storage: {
            total: diskSpace.size,
            free: diskSpace.free,
            used: diskSpace.size - diskSpace.free,
            percent: ((diskSpace.size - diskSpace.free) / diskSpace.size * 100).toFixed(1)
        },
        memory: {
            total: memory.total,
            free: memory.free,
            used: memory.used,
            percent: (memory.used / memory.total * 100).toFixed(1)
        },
        cpu: {
            load: cpu.currentLoad.toFixed(1),
            temp: temp.main || 'N/A'
        },
        uptime: si.time().uptime
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch system stats' });
  }
});

// Backward compatibility (old route)
router.get('/storage', auth, async (req, res) => {
    try {
      const diskSpace = await checkDiskSpace(STORAGE_PATH);
      res.json({
        total: diskSpace.size,
        free: diskSpace.free,
        used: diskSpace.size - diskSpace.free,
      });
    } catch (err) {
      res.json({ total: 0, free: 0, used: 0 });
    }
});

// Get Activity Logs (Admin Only)
router.get('/activity', auth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const logs = db.prepare(`
    SELECT activity.*, users.email 
    FROM activity 
    JOIN users ON activity.user_id = users.id 
    ORDER BY timestamp DESC LIMIT 10
  `).all();
  res.json(logs);
});

module.exports = router;
