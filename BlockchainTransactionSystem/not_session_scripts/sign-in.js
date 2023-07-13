
const fs = require('fs');

const findAccountAndCheckPassword = require('../database/check_get/find-account-check-password.js');
const registrationPage = require('./registration.js');
const {setSessionAccountWallet} = require('../blockchain/transaction.js');
const {sessionHomePage} = require('../session_scripts/session-home.js');



function signInLoad(res, app){
  
  fs.readFile('pages/not_session_pages/sign-in.html', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.send(data);

    app.post('/1', (req, res) => {
      const name = String(req.body.name);
      const email = String(req.body.email);
      const password = String(req.body.password);

      console.log(`name: ${name}\n email: ${email}\n password: ${password}`);

      const query = {
        Name: name,
        Email: email
      };

      findAccountAndCheckPassword(query, password)
        .then(account => {
          switch (account) {
            case 1:
              res.send('<script>window.location.href="/pages/not_session_pages/sign-in.html"; alert("Password is not correct!");</script>');
              break;
            case 2:
              res.send('<script>window.location.href="/pages/not_session_pages/sign-in.html"; alert("Email or Name is not correct!");</script>');
              break;
            case account:
              setSessionAccountWallet(account.WalletNumber);
              sessionHomePage(res, app, account.WalletNumber);
              break;
          }
        })
        .catch(error => {
          console.log('Error while finding account:', error);
        });
    
    });
  });
}

function signInPage(app){

  app.get('/pages/not_session_pages/sign-in.html', (req, res) => {
    signInLoad(res, app);
  });

  registrationPage(app);

}


module.exports = {signInPage, signInLoad};