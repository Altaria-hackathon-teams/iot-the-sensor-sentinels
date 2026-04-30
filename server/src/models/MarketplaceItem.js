const mongoose = require('mongoose');

const MarketplaceItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true, // Now required for better listing quality
        trim: true,
    },
    // --- Redesigned Transactional Fields ---
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    unitType: { // e.g., 'kg', 'dozen', 'piece', 'liter'
        type: String,
        required: true,
        enum: ['kg', 'dozen', 'bag', 'liter', 'bunch', 'piece', 'other'],
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    status: { // e.g., Active, Sold Out, Pending, Canceled
        type: String,
        default: 'Active',
        enum: ['Active', 'Sold Out', 'Pending', 'Canceled'],
    },
    // --- Seller Reference (Remains the same) ---
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MarketplaceItem', MarketplaceItemSchema);