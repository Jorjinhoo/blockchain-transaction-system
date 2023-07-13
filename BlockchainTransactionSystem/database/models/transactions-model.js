const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AccountTransactionsSchema = new Schema({
  Id: {
    type: Number,
    require: true
  },
  WalletNumber: {
    type: String,
    required: true
  },
  RecipientWalletNumber: {
    type: String,
    required: true
  },
  TransactionAmount: {
    type: Number,
    required: true
  },
  TransactionDate: {
    type: String,
    required: true
  },
  TransactionHash: {
    type: String,
    require: true
  },
  PrevTransHash: {
    type: String,
    require: true
  }
})

const AccountTransactionsModel = mongoose.model('AccountTransactions', AccountTransactionsSchema);

module.exports = AccountTransactionsModel;