const AccountsModel = require('../models/accounts-model.js');

async function checkEmailExists(email) {
  try {
    const account = await AccountsModel.findOne({ Email: email }).exec();
    return account !== null;
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = checkEmailExists;