const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  number: { 
    type: String, 
    required: true, 
    unique: true 
  },
  secondaryNumber: { 
    type: String, 
    default: '' 
  },
  name: { 
    type: String, 
    required: true 
  },
  companyName: { 
    type: String, 
    default: '' 
  },
  email: { 
    type: String, 
    default: '' 
  },
  dealValue: { 
    type: Number, 
    default: 0 
  },
  leadScore: { 
    type: Number, 
    default: 0 
  },
  disposition: { 
    type: String, 
    enum: ['SKIP', 'CONTACTED', 'QUALIFIED', 'NEW', 'WRONG NUMBER', 'INTERESTED', 'UNREACHABLE', 'NOT INTERESTED'], 
    default: 'NEW' 
  },
  address: { 
    type: String, 
    default: '' 
  },
  extra: { 
    type: String, 
    default: '' 
  },
  remarks: { 
    type: String, 
    default: '' 
  },
  note: { 
    type: String, 
    default: '' 
  },
  createdOn: { 
    type: Date, 
    default: Date.now 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Member', 
    default: null 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'MISSED'], 
    default: 'PENDING' 
  },
  list: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'List', 
    default: null 
  }
});

module.exports = mongoose.model('Contact', contactSchema);