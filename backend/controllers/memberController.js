const Member = require('../models/Member');
const List = require('../models/List');
const Team = require('../models/Team');
const bcrypt = require('bcryptjs');
const { Parser } = require('json2csv');


// Create a member
const createMember = async (req, res) => {
  const { name, email, userId, password, role, team, phone } = req.body;

  try {
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ msg: 'Member with this email already exists' });
    }

    // Ensure team is an array
    let teamIds = team;
    if (typeof team === 'string') {
      teamIds = [team];
    }

    if (!Array.isArray(teamIds)) {
      return res.status(400).json({ msg: 'Team must be an array or string' });
    }

    // Validate team IDs
    for (const teamId of teamIds) {
      const teamDoc = await Team.findById(teamId);
      if (!teamDoc) {
        return res.status(400).json({ msg: `Team with ID '${teamId}' not found` });
      }
    }

    const newMember = new Member({
      name,
      email,
      userId,
      password,
      role,
      team: teamIds,
      phone,
    });

    await newMember.save();

    // Update assignedTo in Team model
    for (const teamId of teamIds) {
      await Team.findByIdAndUpdate(
        teamId,
        {
          $addToSet: { assignedTo: newMember._id },
          updatedAt: new Date()
        },
        { new: true }
      );
    }

    res.status(201).json({ msg: 'Member created successfully', member: newMember });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};



// Fetch all members
const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .select('-password')
      .populate('team', 'name');

    if (members.length === 0) {
      return res.status(404).json({ msg: 'No members found' });
    }

    const memberIds = members.map((member) => member._id);
    const lists = await List.find(
      { assignedTo: { $in: memberIds } },
      { name: 1, assignedTo: 1 } // Only fetch name and assignedTo fields
    );

    const membersWithLists = members.map((member) => {
      const memberLists = lists
        .filter((list) => list.assignedTo?.toString() === member._id.toString())
        .map(list => list.name); // Only include list names

      const teamNames = member.team.map(team => team.name); // Only include team names

      return {
        ...member.toObject(),
        team: teamNames, // array of strings
        lists: memberLists // array of strings
      };
    });

    res.status(200).json(membersWithLists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};



// Change password
const changePassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    const member = await Member.findOne({ userId });
    if (!member) {
      return res.status(404).json({ msg: "Member not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    member.password = hashedPassword;
    await member.save();

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};



// Delete a member
const deleteMember = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedMember = await Member.findOneAndDelete({ userId });

    if (!deletedMember) {
      return res.status(404).json({ msg: 'Member not found' });
    }

    // Remove member ID from assignedTo in related teams
    await Team.updateMany(
      { assignedTo: deletedMember._id },
      {
        $pull: { assignedTo: deletedMember._id },
        $set: { updatedAt: new Date() }
      }
    );

    res.status(200).json({ msg: 'Member deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// Delete all mebers
const deleteAllMembers = async (req, res) => {
  try {
    const result = await Member.deleteMany({});

    res.status(200).json({
      msg: 'All members deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};



// Update member details
const updateMember = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const { memberId } = req.params;

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ msg: 'Member not found' });
    }

    if (name) member.name = name;
    if (phone) member.phone = phone;

    member.updatedAt = Date.now();

    await member.save();

    res.status(200).json({ msg: 'Member updated successfully', member });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};



const exportMembers = async (req, res) => {
  try {
    const members = await Member.find()

    if (members.length === 0) {
      return res.status(404).json({ msg: 'No members found' });
    }

    const fields = [
      'name',
      'email',
      'userId',
      'role',
      'team',
      'phone',
      'createdAt',
      'updatedAt',
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(members);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=members.csv');

    res.status(200).send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


const getListsByMember = async (req, res) => {
  const { memberId } = req.params;

  try {
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ msg: 'Member not found' });
    }

    const lists = await List.find({ assignedTo: memberId });

    res.status(200).json(lists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};



// Fetch all members within a team
const getAllMembersInTeam = async (req, res) => {
  try {
    const { teamId } = req.query;

    if (!teamId) {
      return res.status(400).json({ message: "Team ID is required" });
    }

    const teamExists = await Team.findById(teamId);
    if (!teamExists) {
      return res.status(404).json({ message: "Team not found" });
    }

    const members = await Member.find({ team: teamId });

    res.status(200).json({ message: "Members fetched successfully for the team", data: members });
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch team members",
      error: error.message,
    });
  }
};



// update member is login/logout in mobile app
const updateLoginStatus = async (req, res) => {
  try {
    const { memberId, isLoggedIn } = req.body;

    if (!memberId || typeof isLoggedIn !== "boolean") {
      return res.status(400).json({ success: false, message: "Invalid input data" });
    }

    const updatedMember = await Member.findByIdAndUpdate(
      memberId,
      {
        isLoggedIn,
        lastActivity: Date.now(),
      },
      { new: true } // Ensures it returns the updated document
    );

    if (!updatedMember) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    res.status(200).json({
      success: true,
      message: `Member login status updated to ${isLoggedIn ? "logged in" : "logged out"}`,
      data: updatedMember,
    });
  } catch (error) {
    console.error("Error updating login status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update login status",
      error: error.message,
    });
  }
};





module.exports = {
  createMember,
  getAllMembers,
  changePassword,
  deleteMember,
  deleteAllMembers,
  updateMember,
  exportMembers,
  getListsByMember,
  getAllMembersInTeam,
  updateLoginStatus
}