const bcrypt = require('bcryptjs');

const AccountsModel = require('../models/accounts-model.js');


async function findAccountAndCheckPassword(query, password) {
  try {
    const account = await AccountsModel.findOne(query);

    const notpassword = 1;
    const notemailorname = 2;

    if(account){
      const isPasswordMatch = await bcrypt.compare(password, account.Password);
      if (isPasswordMatch) {
        console.log('The password is correct');
        return account;
      } else {
        console.log('The password is incorrect');
        return notpassword;
      }
    }else{
      console.log('Email or name is not correct');
      return notemailorname;
    }
  } catch (error) {
    throw error;
  }
}


module.exports = findAccountAndCheckPassword;