const express = require("express");
const upload = require("../utils/upload");
const {
  createContact,
  uploadContactsFromCSV,
  getAllContacts,
  getAllListContacts,
  exportContactsByList,
  exportAllContacts,
  assignContactsFromListToMember,
  removeAssignment
} = require("../controllers/contactController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/addContact", authMiddleware, createContact);

router.post('/addContacts-csv', authMiddleware, upload.single('file'), uploadContactsFromCSV);

router.get("/fetchAllContacts", getAllContacts);

router.get("/fetchAllListContacts", getAllListContacts);

router.get('/exportContactsByList/:id', exportContactsByList);

router.get('/exportAllContacts', exportAllContacts);

router.post('/assignContactsFromList', authMiddleware, assignContactsFromListToMember);

router.put('/removeAssignmentFromList', authMiddleware, removeAssignment);

module.exports = router;
