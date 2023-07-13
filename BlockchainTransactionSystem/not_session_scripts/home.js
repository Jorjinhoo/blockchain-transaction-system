
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const {signInPage} = require('./sign-in.js');

function homePage(app){

  app.use('/styles', express.static(__dirname + '/../styles'));
  app.use('/logos', express.static(__dirname + '/../logos'));

  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/', (req, res) => {

    fs.readFile('pages/not_session_pages/home.html', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.send(data);

    });
 });
  signInPage(app);
}


module.exports = homePage;
