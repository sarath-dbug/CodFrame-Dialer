const express = require('express');
const {
    createList,
    getAllLists,
    getListById,
    getListsByTeam,
    updateList,
    deleteList,
    emptyList,
} = require('../controllers/listController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/addList', authMiddleware, createList);

router.get('/fetchAllList', getAllLists);

router.get('/fetchSingleList/:id', getListById);

router.get('/fetchListsByTeam', getListsByTeam);

router.put('/updateList/:id', authMiddleware, updateList);

router.delete('/deleteList/:id', authMiddleware, deleteList);

router.delete('/emptyList/:id', authMiddleware, emptyList);



module.exports = router;