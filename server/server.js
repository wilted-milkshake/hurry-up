var express = require('express');
var bodyParser = require('body-parser');
var db = require('./app/config');

var app = express();
console.log('Hurry-up is listening on 8080');
app.listen(8080);
