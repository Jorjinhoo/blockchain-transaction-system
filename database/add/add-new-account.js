const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');

const AccauntsModel = require('../models/accounts-model.js');


async function generateUniqueWalletNumber() {
  let walletNumber;
  let isUnique = false;

  while (!isUnique) {
    walletNumber = randomBytes(5).toString('hex');
    const existingAccount = await AccauntsModel.findOne({ WalletNumber: walletNumber });

    if (!existingAccount) {
      isUnique = true;
    }
  }

  return walletNumber;
}


async function addNewAccount(name, email, password) {
  try {

    const hashedPassword = await bcrypt.hash(password, 4);
    const maxIdAccount = await AccauntsModel.findOne({}, 'Id').sort('-Id').exec();

    let previousId = maxIdAccount ? parseInt(maxIdAccount.Id) : 0;
    const newId = previousId + 1;

    const walletNumber = await generateUniqueWalletNumber();

    const accountData = {
      Id: newId,
      Name: name,
      Email: email,
      Password: hashedPassword,
      WalletNumber: walletNumber,
      AccountBalance: 100
    };

    const newAccount = new AccauntsModel(accountData);
    await newAccount.save();
    console.log('New account added to the database');
  } catch (error) {
    console.log('Error saving account:', error);
  }
}

module.exports = addNewAccount;













