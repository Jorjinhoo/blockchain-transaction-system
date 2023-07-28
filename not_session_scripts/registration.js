const fs = require('fs');

const addNewAccount = require('../database/add/add-new-account.js');
const checkEmailExists = require('../database/check_get/check-email-exist.js');
const succesfullyAccCreate = require('./succesfully-acc-create.js');


function registrationPage(app){

  app.get('/pages/not_session_pages/registration.html', (req, res) => {

    fs.readFile('pages/not_session_pages/registration.html', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }

     res.send(data);

     app.post('/pages/not_session_pages/succesfully-acc-create.html', async (req, res) => {
      const name = String(req.body.name);
      const email = String(req.body.email);
      const password = String(req.body.password);
    
      console.log(`name: ${name}\n email: ${email}\n password: ${password}`);
      
      try {
        const emailExists = await checkEmailExists(email);
        if (!emailExists) {
          addNewAccount(name, email, password);
          succesfullyAccCreate(res);
        } else {
          res.send(`
          <script>
            window.location.href="/pages/not_session_pages/registration.html";
            alert("The provided email address is already registered. Please log in to your account or enter a different email address");
          </script>
          `);
        }
       } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
       }

      });
    });
  });
}

module.exports = registrationPage;



