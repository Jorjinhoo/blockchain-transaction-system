const fs = require('fs');


function succesfullyAccCreate(res){
  
  fs.readFile('pages/not_session_pages/succesfully-acc-create.html', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

  res.send(data);

  });
}

module.exports = succesfullyAccCreate;