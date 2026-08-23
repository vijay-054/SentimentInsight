const express = require('express');
const db = require('../database');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM history WHERE userId = ? ORDER BY created_at DESC LIMIT 50',
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    }
  );
});

router.delete('/', authenticateToken, (req, res) => {
  db.run('DELETE FROM history WHERE userId = ?', [req.user.id], function(err) {
     if (err) return res.status(500).json({ error: 'Database error' });
     res.json({ success: true });
  });
});

module.exports = router;
