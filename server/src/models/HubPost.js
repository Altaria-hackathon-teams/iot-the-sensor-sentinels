const mongoose = require('mongoose');

const HubPostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This links the post to a User
        required: true,
    },
    authorName: {
        type: String, // We store this for easy display
        required: true,
    }
}, {
    timestamps: true // Automatically adds createdAt
});

module.exports = mongoose.model('HubPost', HubPostSchema);