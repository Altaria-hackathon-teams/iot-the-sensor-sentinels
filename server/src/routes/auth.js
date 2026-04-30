const express = require('express');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

// --- @route   POST /api/auth/signup ---
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ message: 'User already exists with that email.' });
        }

        user = new User({
            name,
            email: email.toLowerCase(),
            password,
        });
        await user.save();

        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error logging in after signup.', error: err });
            }
            const userResponse = { id: user.id, name: user.name, email: user.email };
            return res.status(201).json(userResponse);
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// --- @route   POST /api/auth/login ---
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info.message || 'Login failed. Check email or password.' });
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            const userResponse = { id: user.id, name: user.name, email: user.email };
            return res.status(200).json(userResponse);
        });
    })(req, res, next);
});

// --- @route   POST /api/auth/logout ---
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Successfully logged out.' });
        });
    });
});

// --- @route   GET /api/auth/check-session ---
const { isLoggedIn } = require('../utils/authMiddleware');

router.get('/check-session', isLoggedIn, (req, res) => {
    const { id, name, email } = req.user;
    res.status(200).json({
        isAuthenticated: true,
        user: { id, name, email }
    });
});

module.exports = router;