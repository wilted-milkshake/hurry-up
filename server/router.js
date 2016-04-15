var app = require('./server-config.js');
var Users = require('./app/collections/users.js');
var User = require('./app/models/user.js');
var Events = require('./app/collections/events.js');
var Event = require('./app/models/event.js');
var bodyParser = require('body-parser');
var worker = require('./worker.js');
var bcrypt = require('bcrypt');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  // compare to db

  // redirect?

});

app.post('/api/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var phoneNumber = '+1' + req.body.password;

  // check username against db to avoid duplicate users
  new User({ username: username }).fetch().then(function(found) {
    if (found) {
      console.log('Sorry, that username is already in the database!');
    } else {
      // if we decide to use a salt, we pass it in instead of null
      bcrypt.hash(password, null, function(err, hashedPassword){
        Users.create({
          username: username,
          password: hashedPassword,
          phoneNumber: phoneNumber
        }).then(function(user) {
          // this would be where we create a session or execute whatever action
          // needs to take place after a user is successfully created.  
        });
      });
    }
  });

});

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

//PUT request for every new user location (PUTs to Origin field in Users table)
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
            if (events.length !== 0) {
              //Call the GoogleApi worker for each event
              events.forEach(function(event) {
                worker(event.attributes, updatedUser.attributes.origin);
              });
              updatedUser.clearWatch = false;
              console.log(updatedUser);
              res.status(201).send({clearWatch: false, updatedUser: updatedUser});
            } else {
              console.log("No event scheduled");
              //some how send response to tell worker to clear the watch;
              updatedUser.clearWatch = true;
              res.status(201).send({clearWatch: true, updatedUser: updatedUser});
            }
          });
      });
    }).catch(function(error) {
      res.status(404).send('User not found');
    });
});

app.get('/api/events:id', function(req, res) {
  var userId = req.params.id;
  Event.fetchAll({where: { userId: userId }})
  .then(function(events) {
    res.send(events);
  })
  .catch(function(error) {
    res.status(404).send("Could not get all events");
  });
});

module.exports = app;
