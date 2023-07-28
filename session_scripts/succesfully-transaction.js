const fs = require('fs');



function succesfullyTransaction(res){

  fs.readFile('pages/session_pages/succesfully-transaction.html', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
        res.status(500).send('Internal Server Error');
    return;
    }

  res.send(data);
  });
}

module.exports = succesfullyTransaction;