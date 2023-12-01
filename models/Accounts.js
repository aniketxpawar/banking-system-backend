const mongoose = require('mongoose');

const accountsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  type: {
    type: String,
    enum: ['Deposit', 'Withdrawal'], // Assuming transaction types can be Deposit or Withdrawal
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

const Accounts = mongoose.model('Accounts', accountsSchema);

module.exports = Accounts;
