const db = require('../config/db');

const logActivity = (userId, action, details = '') => {
  try {
    const stmt = db.prepare('INSERT INTO activity (user_id, action, details) VALUES (?, ?, ?)');
    stmt.run(userId, action, details);
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
};

module.exports = logActivity;
