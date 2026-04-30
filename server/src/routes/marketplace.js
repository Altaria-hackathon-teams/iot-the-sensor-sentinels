const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../utils/authMiddleware');
const MarketplaceItem = require('../models/MarketplaceItem');

// --- @route   GET /api/marketplace ---
// @desc    Get all ACTIVE marketplace listings
// @access  Private (Protected)
router.get('/', isLoggedIn, async (req, res) => {
    try {
        // Only fetch listings marked as 'Active' and populate seller details
        const items = await MarketplaceItem.find({ status: 'Active' })
            .populate('seller', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- @route   POST /api/marketplace ---
// @desc    Create a new marketplace listing
// @access  Private (Protected)
router.post('/', isLoggedIn, async (req, res) => {
    try {
        // Collect all required new fields
        const { name, description, quantity, unitType, unitPrice } = req.body;

        if (!name || !description || !quantity || !unitType || !unitPrice) {
            return res.status(400).json({ message: 'Missing required listing fields.' });
        }

        const newItem = new MarketplaceItem({
            name,
            description,
            quantity,
            unitType,
            unitPrice,
            seller: req.user.id // Link to the logged-in user
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error during listing creation.' });
    }
});

// --- @route   PUT /api/marketplace/:id ---
// @desc    Update an existing listing (e.g., change price, mark sold out)
// @access  Private (Owner only)
router.put('/:id', isLoggedIn, async (req, res) => {
    try {
        const item = await MarketplaceItem.findById(req.params.id);

        if (!item) {
            return res.status(44).json({ message: 'Item not found.' });
        }

        // --- AUTHORIZATION CHECK ---
        if (item.seller.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to update this item.' });
        }

        // Apply updates only for allowed fields
        const { name, description, quantity, unitPrice, status } = req.body;

        if (name) item.name = name;
        if (description) item.description = description;
        if (quantity !== undefined) item.quantity = quantity;
        if (unitPrice) item.unitPrice = unitPrice;
        if (status) item.status = status;

        await item.save();
        res.status(200).json(item);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error during listing update.' });
    }
});

// --- @route   DELETE /api/marketplace/:id ---
// @desc    Delete a marketplace listing
// @access  Private (Owner only)
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const item = await MarketplaceItem.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found.' });
        }

        // --- AUTHORIZATION CHECK ---
        if (item.seller.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this item.' });
        }

        await item.deleteOne();
        res.status(200).json({ message: 'Listing permanently removed.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;