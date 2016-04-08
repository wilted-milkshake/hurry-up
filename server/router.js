var app = require('./server-config.js');
var Users = require('./app/collections/users.js');
var User = require('./app/models/user.js');
var Events = require('./app/collections/events.js');
var Event = require('./app/models/event.js');
var bodyParser = require('body-parser');
// var utility = require('./herlp.js');

// app.get()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/event', function(req, res) {
  //1. parse out req.body data

  var eventName = req.body.eventName;
  var eventTime = req.body.eventTime;
  var destination = req.body.destination;
  var earlyArrival = parseInt(req.body.earlyArrival);
  var mode = req.body.mode;
  // TODO: determine username on client side ? or sessions?
  var username = 'Liam';

  //2. write data to db
  // TODO: double check fetch-where query


  new User({ username: username })
    .fetch()
    .then(function(user) {
      var newEvent = new Event({
        eventName: eventName,
        eventTime: eventTime,
        destination: destination,
        earlyArrival: earlyArrival,
        mode: mode,
        userId: user.get('id')
      });

      newEvent.save().then(function(createdEvent) {
        res.status(201).send(createdEvent);
      }).catch(function(err) {
        res.send(500, err);
      });
    }).catch(function(err) {
      res.send(500, err);
    });
});

module.exports = app;
