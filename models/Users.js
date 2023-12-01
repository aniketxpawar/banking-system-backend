const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  },
  balance: {
    type: Number,
    default: null
  }
});

const User = mongoose.model('Users', userSchema);

module.exports = User;
