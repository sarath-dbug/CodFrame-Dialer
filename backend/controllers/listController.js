const List = require('../models/List');
const Contact = require('../models/Contact');
const Team = require('../models/Team');
const json2csv = require('json2csv').parse;

// Create a new list
const createList = async (req, res) => {
    const { name, teamId  } = req.body;

    try {
        const exitingList = await List.findOne({ name });
        if (exitingList) {
            return res.status(400).json({ msg: "List with this name already exists" });
        }

        const team = await Team.findById(teamId);
        if (!team) {
          return res.status(404).json({ msg: 'Team not found' });
        }

        const newList = new List({ name });
        await newList.save();

        team.lists.push(newList._id);
        await team.save();

        res.status(201).json({ msg: 'List created successfully', list: newList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error', err: err.message });
    }
}


// Get all lists
const getAllLists = async (req, res) => {
    try {
        const lists = await List.find();
        res.status(200).json(lists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


// Get a single list by ID
const getListById = async (req, res) => {
    try {
        const list = await List.findById(req.params.id);
        if (!list) {
            return res.status(404).json({ msg: 'List not found' });
        }
        res.status(200).json(list);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


const getListsByTeam = async (req, res) => {
    try {
      const { teamId } = req.query; 
  
      if (!teamId) {
        return res.status(400).json({
          success: false,
          message: 'Team ID is required',
        });
      }
  
      const team = await Team.findById(teamId).populate('lists');
      if (!team) {
        return res.status(404).json({
          success: false,
          message: 'Team not found',
        });
      }
  
      // Extract the populated lists
      const lists = team.lists;
  
      res.status(200).json({
        success: true,
        message: 'Lists fetched successfully for the team',
        data: lists,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: err.message,
      });
    }
  };


// Update a list
const updateList = async (req, res) => {
    const { name } = req.body;

    try {
        const list = await List.findById(req.params.id);
        if (!list) {
            return res.status(404).json({ msg: 'List not found' });
        }

        // Update list fields
        if (name) list.name = name;
        list.updatedAt = Date.now();

        // Save the updated list
        await list.save();

        res.status(200).json({ msg: 'List updated successfully', list });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


// Delete a list and all the contacts associated with it
const deleteList = async (req, res) => {
    try {
        const listId = req.params.id;

        // Step 1: Delete the list
        const list = await List.findByIdAndDelete(listId);
        if (!list) {
            return res.status(404).json({ msg: 'List not found' });
        }

        await Contact.deleteMany({ list: listId });

        res.status(200).json({ msg: 'List and associated contacts deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


// Delete all contacts associated with the list
const emptyList = async (req, res) => {
    try {
        const listId = req.params.id;

        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ msg: 'List not found' });
        }

        await Contact.deleteMany({ list: listId });

        res.status(200).json({ msg: 'All contacts in the list have been deleted', list });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};



module.exports = {
    createList,
    getAllLists,
    getListById,
    getListsByTeam,
    updateList,
    deleteList,
    emptyList,
}