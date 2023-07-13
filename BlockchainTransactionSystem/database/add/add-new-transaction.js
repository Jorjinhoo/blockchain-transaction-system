const AccauntTransactionsModel = require('../models/transactions-model.js');


async function addNewTransaction(transactionAmount, recipientWalletNumber, accountWallet, transactionDate, transactionHash, prevTransHash) {
  try {
    const maxIdTransaction = await AccauntTransactionsModel.findOne({}, 'Id').sort('-Id').exec();

    let previousId;
    
    if (!maxIdTransaction) {
    previousId = 0;
    } else {
    previousId = parseInt(maxIdTransaction.Id);
    }
   const newId = previousId + 1;

    const accountData = {
      Id: newId,
      WalletNumber: accountWallet,
      RecipientWalletNumber: recipientWalletNumber,
      TransactionAmount: transactionAmount,
      TransactionDate: transactionDate,
      TransactionHash: transactionHash,
      PrevTransHash: prevTransHash
    };

    const newTransaction = new AccauntTransactionsModel(accountData);
    await newTransaction.save();
    console.log('New transaction added to the database');
  } catch (error) {
    console.log('Error saving transaction:', error);
  }
}

module.exports = addNewTransaction;
