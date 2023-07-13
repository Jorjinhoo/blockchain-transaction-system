const AccountTransactionsModel = require('../models/transactions-model.js');

async function getAccountTransactionHistory(WalletNumber){
  try{
    const transactions = await AccountTransactionsModel.find({ WalletNumber });
    return transactions;
  }catch(e){
    console.error(e);
    throw e;
  }
}

module.exports = getAccountTransactionHistory;