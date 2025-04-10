const mongoose = require('mongoose');

const callResponseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // Duration in seconds
    required: true,
  },
  timeSpent: {
    type: Number, // Time spent in seconds
    required: true,
  },
  dialer: {
    type: String,
    required: true,
    trim: true,
  },
  calledReceivedBy: {
    type: String,
    required: true,
    trim: true,
  },
  disposition: {
    type: String,
    required: true,
    trim: true,
  },
  remarks: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  template: {
    type: String,
    trim: true,
  },
  recording: {
    type: String, // URL or file path to the recording
    trim: true,
  },
});

const Call = mongoose.model('Call', callResponseSchema);

module.exports = Call;