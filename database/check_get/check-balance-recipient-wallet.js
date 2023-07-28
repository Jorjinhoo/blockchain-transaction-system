const AccountsModel = require('../models/accounts-model.js');


async function checkAccountBalance(amount, sessionAccountWallet) {
  try {
    const account = await AccountsModel.findOne({ WalletNumber: sessionAccountWallet }).exec();
    
    if (account) {
      if (account.AccountBalance >= amount) {
        console.log('The account has sufficient funds for the transaction');
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function checkRecipientExist(recipient) {
  try {
    const account = await AccountsModel.findOne({ WalletNumber: recipient }).exec();

    if (account) {
      console.log('The recipient wallet is correct');
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error while checking recipient existence:", error);
    return false;
  }
}

async function transferFunds(accountWallet, recipientWallet, amount) {
  try {
    const sender = await AccountsModel.findOne({ WalletNumber: accountWallet });

    if (!sender) {
      throw new Error('Отправитель не найден.');
    }

    if (sender.AccountBalance < amount) {
      throw new Error('Недостаточно средств на счете отправителя.');
    }

    const recipient = await AccountsModel.findOne({ WalletNumber: recipientWallet });

    if (!recipient) {
      throw new Error('Получатель не найден.');
    }

    sender.AccountBalance -= amount;
    console.log('sender Wallet - ' + amount);
    recipient.AccountBalance += amount;

    await sender.save();
    await recipient.save();
    console.log('change saved to the database');

    console.log('The transaction has been successfully executed');
  } catch (error) {
    console.error('error during the transaction execution', error.message);
  }
}

module.exports = {checkAccountBalance, checkRecipientExist, transferFunds};


