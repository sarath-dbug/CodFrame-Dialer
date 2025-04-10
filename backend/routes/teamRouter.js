const express = require('express');
const {
    createTeam,
    deleteTeam,
    editTeam,
    getTeamsByUser
} = require('../controllers/teamController');
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();


router.post('/addTeam', authMiddleware, createTeam);

router.get('/fetchTeamsByUser', getTeamsByUser);

router.delete('/deleteTeam/:teamId', authMiddleware, deleteTeam);

router.put('/editTeam', authMiddleware, editTeam);

module.exports = router;
