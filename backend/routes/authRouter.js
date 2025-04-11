const express = require('express');
const {
    registerUser,
    loginUser,
    updateUserProfile,
    changePassword,
    requestPasswordReset,
    verifyOtp,
    resetPassword
} = require('../controllers/authController');
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.put('/profile', authMiddleware, updateUserProfile);

router.put('/change-password', authMiddleware, changePassword);

router.post('/forgot-password', requestPasswordReset);

router.post('/verify-otp', verifyOtp);

router.post('/reset-password', resetPassword);

module.exports = router;