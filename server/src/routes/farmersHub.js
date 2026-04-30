const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../utils/authMiddleware');
const HubPost = require('../models/HubPost');

// --- @route   GET /api/farmers-hub/posts ---
// @desc    Get all community posts
// @access  Private (Protected)
router.get('/posts', isLoggedIn, async (req, res) => {
    try {
        // Find all posts and sort by newest
        const posts = await HubPost.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- @route   POST /api/farmers-hub/posts ---
// @desc    Create a new community post
// @access  Private (Protected)
router.post('/posts', isLoggedIn, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Post content cannot be empty.' });
        }

        const newPost = new HubPost({
            content,
            author: req.user.id, // Link to the user ID
            authorName: req.user.name // Store the user's name for easy display
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- @route   DELETE /api/farmers-hub/posts/:id ---
// @desc    Delete a community post
// @access  Private (Owner only)
router.delete('/posts/:id', isLoggedIn, async (req, res) => {
    try {
        const post = await HubPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // --- SECURITY CHECK ---
        // Make sure the logged-in user is the one who created the post
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized.' });
        }

        await post.deleteOne(); // Use deleteOne()
        res.status(200).json({ message: 'Post removed.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;