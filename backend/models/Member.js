const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['Team Manager', 'Sub Manager', 'Agent'],
    },
    team: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Team',
        required: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    isLoggedIn: {
        type: Boolean,
        required: true,
        default: false, 
      },
      lastActivity: {
        type: Date,
        default: Date.now, 
      },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});


// Exclude password from responses
memberSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    },
});


// Hash password before saving
memberSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Member', memberSchema);