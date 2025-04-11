const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');
const nodemailer = require('nodemailer');


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


const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});


// Request password reset OTP
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete any existing OTP for this email
        await Otp.deleteMany({ email });

        // Save new OTP
        const newOtp = new Otp({ email, otp });
        await newOtp.save();

        // Send email with OTP
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Password Reset OTP',
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F172A;">Password Reset Request</h2>
      <p>Your OTP code is:</p>
      <div style="background: #F1F5F9; padding: 10px; 
            display: inline-block; font-size: 24px;
            letter-spacing: 2px; color: #0F172A;">
        ${otp}
      </div>
      <p style="font-size: 12px; color: #64748B;">
        This code expires in 10 minutes.
      </p>
    </div>
  `
        };

        await transporter.sendMail(mailOptions);

        res.json({
            message: 'OTP sent to your email',
            data: { email }
        });

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

// Verify OTP
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find the OTP record
        const otpRecord = await Otp.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP expired or not found' });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP is valid
        res.json({
            message: 'OTP verified successfully',
            data: { email, otp }
        });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Failed to verify OTP' });
    }
};

// Reset password with OTP
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Verify OTP again
        const otpRecord = await Otp.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate new password
        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        // Hash and save new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        // Delete used OTP
        await Otp.deleteMany({ email });

        res.json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
};


module.exports = {
    registerUser,
    loginUser,
    updateUserProfile,
    changePassword,
    requestPasswordReset,
    verifyOtp,
    resetPassword
};