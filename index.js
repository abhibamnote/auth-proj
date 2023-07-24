const bodyParser = require('body-parser');
const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const session = require("express-session");
const User = require('./models/User');
const passport = require('passport')
mongoose.connect(process.env.MONGO_URI,
  {
    useNewUrlParser: true
  }
);

const router = require('./routes/index')


app.use(bodyParser.json({limit: '2mb'}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.use(
    session({
      secret: process.env.SessionSec,
      resave: false,
      saveUninitialized: false,
    })
);

 
app.use(passport.initialize());
// app.use(passport.session());
require("./config/passportGoogle")
require("./config/passport")(passport);

app.use('/', router);

app.listen(4000, ()=>{
    console.log("Port 4000");
})