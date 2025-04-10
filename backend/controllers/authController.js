const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register User
const registerUser = async (req, res) => {
    const { firstName, lastName, companyName, contactNumber, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ firstName, lastName, companyName, contactNumber, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;

            const userData = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                companyName: user.companyName,
                contactNumber: user.contactNumber,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };

            res.json({ token, user: userData });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { user: { id: user.id } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) throw err;

            const userData = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                companyName: user.companyName,
                contactNumber: user.contactNumber,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };

            res.json({ token, user: userData });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// Update User
const updateUserProfile = async (req, res) => {
    const { firstName, lastName, companyName, contactNumber, userId } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user) {
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.companyName = companyName || user.companyName;
            user.contactNumber = contactNumber || user.contactNumber;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                companyName: updatedUser.companyName,
                contactNumber: updatedUser.contactNumber,
                message: "Profile updated successfully"
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
};

// change password
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error while changing password' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateUserProfile,
    changePassword
};