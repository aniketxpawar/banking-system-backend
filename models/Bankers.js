const mongoose = require('mongoose');

const bankerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const Bankers = mongoose.model('Bankers', bankerSchema);

module.exports = Bankers;
