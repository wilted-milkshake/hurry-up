var app         = require('../server-config.js');
var route       = require('./router-helpers');
var bodyParser  = require('body-parser');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/login', route.login);

app.post('/api/signup', route.signup);

app.post('/api/events', route.addEvent);

app.get('/api/events/:id', route.getAllUserEvents); // id is user id

app.put('/api/users/:id', route.updateUserLocation);

module.exports = app;
