const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id',
    [
        auth,
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('phone', 'Phone number is required').not().isEmpty(),
        check('dateOfBirth', 'Date of birth is required').not().isEmpty(),
        check('gender', 'Gender is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            // Check if the user is updating their own profile
            if (user._id.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Not authorized' });
            }

            // Check if email is already taken by another user
            if (req.body.email !== user.email) {
                const existingUser = await User.findOne({ email: req.body.email });
                if (existingUser) {
                    return res.status(400).json({ msg: 'Email already exists' });
                }
            }

            // Update user fields
            const updateFields = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
                address: req.body.address,
                profilePicture: req.body.profilePicture,
                interests: req.body.interests,
                preferences: req.body.preferences,
                bio: req.body.bio
            };

            // Update only the fields that are provided
            Object.keys(updateFields).forEach(key => {
                if (updateFields[key] !== undefined) {
                    user[key] = updateFields[key];
                }
            });

            await user.save();
            res.json(user);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router; 