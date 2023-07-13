
const cheerio = require('cheerio');
const fs = require('fs');

const {checkDataDoTransaction} = require('../blockchain/transaction.js');
const getAccountBalance = require('../database/check_get/get-account-balance.js');


function sandFormPageLoad(app, res, accountBalance){

  fs.readFile('pages/session_pages/sand-form.html', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const $ = cheerio.load(data);

   const balanceElement = $('#Balance');
   balanceElement.text(accountBalance.toFixed(3));
   res.send($.html());

    app.post('/', (req, res) => {
     const recipient = String(req.body.recipient);
     const amount = parseFloat(req.body.amount);

     checkDataDoTransaction(recipient, amount, res);
   });
  });
}

let WalletNum;
function setWalletNum(WalletNumber){
  WalletNum = WalletNumber;
}


function sandFormPage(app, WalletNumber){

  setWalletNum(WalletNumber);

  app.get('/pages/session_pages/sand-form.html', async (req, res) => {
    const accountBalance = await getAccountBalance(WalletNum);
    sandFormPageLoad(app, res, accountBalance);
  });
}


module.exports = {sandFormPage};