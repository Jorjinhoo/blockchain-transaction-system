const fs = require('fs');
const cheerio = require('cheerio');

const getAccountTransactionHistory = require('../database/check_get/get-transaction-history.js');


let WalletNum;
function setWalletNum(WalletNumber){
  WalletNum = WalletNumber;
}

function transactionHistoryPage(app, WalletNumber){

  setWalletNum(WalletNumber);

  app.get('/pages/session_pages/transactions-history.html', async (req, res) => {
  
    const accountTransactionHistory = await getAccountTransactionHistory(WalletNum);
    
    fs.readFile('pages/session_pages/transactions-history.html', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      const $ = cheerio.load(data);

      const transactionBlockElement = $('.transaction-block');

      transactionBlockElement.not(':first-child').remove();

      for (let i = 1; i < accountTransactionHistory.length; i++) {
        const newTransactionBlock = transactionBlockElement.clone();
        transactionBlockElement.after(newTransactionBlock);
      }

      const transactionElements = $('.transaction');

      for (let i = 0; i < accountTransactionHistory.length; i++) {
        const transaction = accountTransactionHistory[i];

        const transactionText = `Id: ${transaction.Id}\n` +
        `WalletNumber: ${transaction.WalletNumber}\n` +
        `RecipientWalletNumber: ${transaction.RecipientWalletNumber}\n` +
        `TransactionAmount: ${transaction.TransactionAmount}\n` +
        `TransactionDate: ${transaction.TransactionDate}\n` +
        `TransactionHash: ${transaction.TransactionHash}\n` +
        `PrevTransHash: ${transaction.PrevTransHash}`;
        

        $(transactionElements[i]).text(transactionText);
    
        $(transactionElements[i]).css('white-space', 'pre-line');
    
        $(transactionElements[i]).css('font-weight', 'bold');
      }

      const modifiedHTML = $.html();
      res.send(modifiedHTML);

    });
  });
}

module.exports = {transactionHistoryPage};