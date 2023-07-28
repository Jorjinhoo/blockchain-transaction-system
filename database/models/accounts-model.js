const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AccountsSchema = new Schema({
  Id: {
    type: String,
    required: true
  },
  Name: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
  WalletNumber: {
    type: String,
    required: true
  },
  AccountBalance: {
    type: Number,
    require: true
  }
});

const AccountsModel = mongoose.model('AccountsData', AccountsSchema);

module.exports = AccountsModel;