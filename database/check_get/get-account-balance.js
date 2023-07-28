const AccountsModel = require('../models/accounts-model.js');

async function getAccountBalance(WalletNumber) {
  try {
    const account = await AccountsModel.findOne({WalletNumber: WalletNumber});
    if(account){
      const accountBalance = await account.AccountBalance;
      return accountBalance;
    }
  } catch (error) {
    throw error;
  }
}

module.exports = getAccountBalance;