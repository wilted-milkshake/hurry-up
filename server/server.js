var express = require('express');
var bodyParser = require('body-parser');

var db = require('./app/config.js');
var Users = require('./app/collections/users.js');
var User = require('./app/models/user.js');
var Events = require('./app/collections/events.js');
var Event = require('./app/models/event.js');

var app = express();



console.log('Hurry-up is listening on 8080');
app.listen(8080);
