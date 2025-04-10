const express = require('express');
const { storeCallResponse, getAllCallResponses } = require('../controllers/callController');
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/callResponses', authMiddleware, storeCallResponse);

router.get('/fectAllCallResponses', getAllCallResponses);

module.exports = router;