const express = require('express');
const router = express.Router();

// Get user role (mock implementation)
router.get('/roles/:userId', (req, res) => {
    const userId = req.params.userId;
    // For demonstration, let's say user with ID 1 is a manager, others are regular admins
    const role = userId === '1' ? 'manager' : 'admin';
    res.json([{ role }]);
});

module.exports = router