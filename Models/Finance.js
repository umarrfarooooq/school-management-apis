const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  transactionType: {
    type: String,
    required: true,
    enum: ['incoming', 'outgoing']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Finance = mongoose.model('Finance', financeSchema);

module.exports = Finance;
