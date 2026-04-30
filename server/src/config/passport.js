const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

// --- Local Strategy for Email/Password Login ---
passport.use(new LocalStrategy(
    {
        usernameField: 'email' // Use email as the "username"
    },
    async (email, password, done) => {
        try {
            // 1. Find the user by email
            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                return done(null, false, { message: 'Email not found.' });
            }

            // 2. Compare the password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            // 3. Success! Return the user
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// --- Session Management ---
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});