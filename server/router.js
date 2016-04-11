var app = require('./server-config.js');
var Users = require('./app/collections/users.js');
var User = require('./app/models/user.js');
var Events = require('./app/collections/events.js');
var Event = require('./app/models/event.js');
var bodyParser = require('body-parser');
var worker = require('./worker.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/events', function(req, res) {
  Event.fetchAll({})
    .then(function(events) {
      res.status(200).json(events);
    })
    .catch(function(err) {
      console.error(err);
    });
});

//POST request for every new event
app.post('/api/events', function(req, res) {
  var eventName = req.body.eventName;
  var eventTime = req.body.eventTime;
  var destination = req.body.destination;
  var earlyArrival = req.body.earlyArrival;
  var mode = req.body.mode;

  // TODO: determine username on client side ? or sessions?
  var username = 'Liam';

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

//PUT request for every new user location (Origin field in Users table)
app.put('/api/users/:id', function(req, res) {
  var userId = req.params.id;
  var origin = req.body.origin;
  //Set User Location
  new User({ id: userId })
    .fetch()
    .then(function(user) {
      user.set('origin', origin);
      user.save().then(function(updatedUser) {
        //Fetch all user events
        Event.fetchAll({ where: { userId: userId }})
          .then(function(events) {
            console.log("ALL EVENT", events.length);
            //if no events clear watch here??
            events.forEach(function(event) {
              //Call the GoogleApi worker for each event
              worker(event.attributes, updatedUser.attributes.origin);
            });
          });
        res.status(201).send(updatedUser);
      });
    }).catch(function(error) {
      res.status(404).send('User not found');
    });
});

module.exports = app;
