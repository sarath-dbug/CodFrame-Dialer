const express = require('express');
const { updateMemberAttendance, getMemberAttendance  } = require('../controllers/attendanceController');
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/updateMemberAttendance',authMiddleware, updateMemberAttendance );

router.get('/fetchMemberAttendance', getMemberAttendance );

module.exports = router;