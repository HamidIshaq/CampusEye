const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || password.length !== 8) {
        return res.status(400).json({ message: 'Invalid credentials or password length' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid user' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

        res.json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
