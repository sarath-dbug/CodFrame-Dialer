const Call = require('../models/Call');
const Team = require('../models/Team');

// store a call response from front-end
const storeCallResponse = async (req, res) => {
  try {
    const {
      name,
      phone,
      date,
      time,
      duration,
      timeSpent,
      dialer,
      calledReceivedBy,
      disposition,
      remarks,
      notes,
      list,
      team,
      memberId,
      template,
      recording,
    } = req.body;

    const newCallResponse = new Call({
      name,
      phone,
      date,
      time,
      duration,
      timeSpent,
      dialer,
      calledReceivedBy,
      disposition,
      remarks: remarks?.trim() || "",
      notes: notes?.trim() || "",
      list,
      team,
      memberId,
      template: template?.trim() || "",
      recording: recording?.trim() || "",
    });

    await newCallResponse.save();

    res.status(201).json({
      message: "Call response stored successfully",
      data: newCallResponse,
    });
  } catch (error) {
    console.error("Error storing call response:", error);
    res.status(500).json({
      message: "Failed to store call response",
      error: error.message,
    });
  }
};



const getAllCallResponses = async (req, res) => {
  try {
    const { teamId } = req.query;

    if (!teamId) {
      return res.status(400).json({ message: "Team ID is required" });
    }

    const teamExists = await Team.findById(teamId);
    if (!teamExists) {
      return res.status(404).json({ message: "Team not found" });
    }

    const callResponses = await Call.find({ team: teamId });

    res.status(200).json({
      success: true,
      message: "Call responses fetched successfully for the team",
      data: callResponses,
    });
  } catch (error) {
    console.error("Error fetching call responses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch call responses",
      error: error.message,
    });
  }
};


module.exports = {
  storeCallResponse,
  getAllCallResponses
};