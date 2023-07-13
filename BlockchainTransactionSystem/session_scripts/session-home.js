
const fs = require('fs');
const cheerio = require('cheerio');

const {sandFormPage} = require('./sand-form.js');
const getAccountBalance = require('../database/check_get/get-account-balance.js');
const {transactionHistoryPage} = require('./transactions-history.js');



function sessionHomePageLoad(accountBalance, WalletNumber, res){

  fs.readFile('pages/session_pages/session-home.html', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    
     const $ = cheerio.load(data);

     const balanceElement = $('#Balance');
     balanceElement.text(accountBalance.toFixed(3));

     const walletNumberElement = $('#AWNumber');
     walletNumberElement.text(WalletNumber); 
 
     res.send($.html());
  });
}


let WalletNum;
function setWalletNum(WalletNumber){
  WalletNum = WalletNumber;
}

async function sessionHomePage(res, app, WalletNumber){

  const accountBalance = await getAccountBalance(WalletNumber);
  
  sessionHomePageLoad(accountBalance, WalletNumber, res);

  setWalletNum(WalletNumber);

  app.get('/pages/session_pages/session-home.html', async (req, res) => {
    console.log(WalletNum + ' USAIEM WALLET');
    const accountBalance = await getAccountBalance(WalletNum);
    sessionHomePageLoad(accountBalance, WalletNum, res);
  });

  sandFormPage(app, WalletNum);
  transactionHistoryPage(app, WalletNum);
  
}

module.exports = {sessionHomePage};
