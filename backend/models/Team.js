const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        default: []
    }],
    lists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'List',
            default: [],
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Team', teamSchema);
