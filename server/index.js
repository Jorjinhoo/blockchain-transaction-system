const express = require('express');
const mongoose = require('mongoose');

const homePage = require('../not_session_scripts/home.js');

const app = express();
const port = process.env.PORT || 5500;
const db = process.env.DATABASE_URL || 'mongodb+srv://Admin:Admin123@accountsdata.ashibkj.mongodb.net/?retryWrites=true&w=majority&appName=AccountsData';
//const db = process.env.DATABASE_URL || 'mongodb+srv://Admin:Admin123@Accounts.ashibkj.mongodb.net/AccountsData?retryWrites=true&w=majority';

//server running
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  //home page load
  homePage(app);

  //Database connection
  mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console
  .log('Connected to DB'))
  .catch((error) => console.log(error));
});





