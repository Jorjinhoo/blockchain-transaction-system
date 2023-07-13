const fs = require('fs');

const Block = require('./block-mining.js');
const addNewTransaction = require('../database/add/add-new-transaction.js');
const {checkAccountBalance, checkRecipientExist, transferFunds} = require('../database/check_get/check-balance-recipient-wallet.js');
const succesfullyTransaction = require('../session_scripts/succesfully-transaction.js');


let sessionAccountWallet;

function setSessionAccountWallet(wallet){
  sessionAccountWallet = wallet;
}

function transaction(transaction = {accountWallet, recipient, amount}, res){

  fs.readFile('blockchain/block-data.txt', 'utf8', async (err, data) => {
    if (err) {
      console.error('file read error:', err);
      return;
    }

    const lines = data.split('\n');
  
    // Check if is enough data in the file
    if (lines.length < 4) {
      console.error('insufficient data in the blockchain file');
      return;
    }
  
    const lastFourLines = lines.slice(-4);
  
    // Extract values from the last four lines
    const blockId = parseInt(lastFourLines[0].split(': ')[1]);
    const blockHash = lastFourLines[3].split(': ')[1];

    const date = new Date();
    const timestamp = date.toLocaleString();

    const block1 = new Block(timestamp, blockId, blockHash, transaction);

    const dataToBlockchainWrite = `\n\nBlock ID: ${block1.blockId}\nTimestamp: ${block1.timestamp}\nPrevious Block Hash: ${block1.prevBlockHash}\nBlock Hash: ${block1.blockHash}`;   // Format the data for writing to the blockchain file
  
    // Append the new data to the end of the blockchain file
    fs.appendFile('blockchain/block-data.txt', dataToBlockchainWrite, err => {
      if (err) {
        console.error('error while writing to the blockchain file: ', err);
        return;
      }
      console.log('data successfully written to the file: block-data.txt.');
    });
  
    await transferFunds(sessionAccountWallet, block1.transaction.recipient, block1.transaction.amount);   // Transfer funds to the recipient
    
    await addNewTransaction(block1.transaction.amount, block1.transaction.recipient, sessionAccountWallet, block1.timestamp, block1.blockHash, block1.prevBlockHash);   // Add the new transaction to the database

    succesfullyTransaction(res);  //Next page load
  
  });
}

function checkBlockchainData(recipient, amount, res){
   
   const fileContent = fs.readFileSync('blockchain/block-data.txt', 'utf-8');   
   const blocks = fileContent.split('\n\n');   // Split the blockchain file content into blocks
   const blockCount = blocks.length;   
   const regex = /Block Hash: ([a-fA-F0-9]+)/;   // Regular expression pattern to match block hashes

   if (blockCount >= 2) {

     let mismatchCount = 0;

     for(let i = 1; i < blocks.length; i++){

       let previousBlockHash
       let currentBlockHash
       
       const match = blocks[i].match(regex);   // Match the block hash pattern in the current block
       if (match) {
         previousBlockHash = match[1];   // Extract the captured hash and assign it to previousBlockHash
       }
      
         const lines = blocks[i-1].split('\n');   // Split the lines of the previous block
       
         for (let j = 0; j < lines.length; j++) {
           if (lines[j].startsWith('Block Hash: ')) {
             const match2 = lines[j].match(regex);   // Match the block hash pattern in the line
             if (match2) {
               currentBlockHash = match2[1];
             }
           }
         }
         
       if (previousBlockHash.toString() !== currentBlockHash.toString()) {
         mismatchCount++;
         console.log('not a true hash: ' + i);
         return;
       }
     }
     
     if (mismatchCount === 0) {   // Check if there were no mismatches hashes
       transaction({sessionAccountWallet, recipient, amount}, res);
     }
   } else {   //Execution if in the blockchain file are fewer than 2 blocks (in file only the genesis block)
     transaction({sessionAccountWallet, recipient, amount}, res);
   }
}

async function checkDataDoTransaction(recipient, amount, res) {

  if (typeof recipient === 'string' && typeof amount === 'number') {   
    if (await checkAccountBalance(amount, sessionAccountWallet)) {   
      if (await checkRecipientExist(recipient)) {   
        checkBlockchainData(recipient, amount, res);   // Proceed with checking blockchain data
      } else {
        res.send('<script>alert("The recipient does not exist! Please enter a valid recipient wallet number");window.location.href="pages/session_pages/sand-form.html";</script>');
        return;
      }
    } else {
      res.send('<script>alert("There are insufficient funds in your account. Please enter a smaller amount");window.location.href="pages/session_pages/sand-form.html";</script>');
      return;
    }
  } else if (recipient === '' || isNaN(amount)) {
    console.log("error: bad data-type!!!");
    return;
  } else {
    console.log("bad data-type");
    return;
  }
}

module.exports = { checkDataDoTransaction, setSessionAccountWallet};