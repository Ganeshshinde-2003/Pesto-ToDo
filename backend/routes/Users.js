const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users - Create a new user
router.post('/', async (req, res) => {
    const { email, firebaseId, name } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            email,
            firebaseId,
            name,
        });

        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/users/:firebaseId - Get user by firebaseId
router.get('/:firebaseId', async (req, res) => {
    const { firebaseId } = req.params;

    try {
        const user = await User.findOne({ firebaseId });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
