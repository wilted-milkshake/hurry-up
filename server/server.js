var express = require('express');
var bodyParser = require('body-parser');

var db = require('./app/config.js');
var Users = require('./app/collections/users.js');
var User = require('./app/models/user.js');
var Events = require('./app/collections/events.js');
var Event = require('./app/models/event.js');

var app = express();


// create new user:
// new User({ username: , password: , phoneNumber: }).save()

// create new event:
// fetch User where username=currentuser
  // new Event({ all event data, userId: user.get('id') }).save();

// fetch all events from currUser
  // new Event({ userId: currUser.id }).fetch()

  

console.log('Hurry-up is listening on 8080');
app.listen(8080);
