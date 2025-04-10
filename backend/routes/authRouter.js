const express = require('express');
const {
    registerUser,
    loginUser,
    updateUserProfile,
    changePassword
} = require('../controllers/authController');
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.put('/profile', authMiddleware, updateUserProfile);

router.put('/change-password', authMiddleware, changePassword);

module.exports = router;