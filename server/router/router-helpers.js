var User   = require('../app/models/user.js');
var Event  = require('../app/models/event.js');
var bcrypt = require('bcrypt');
var googleWorker = require('../workers/google-api-call.js');

exports.addEvent = function(req, res) {
  var mode         = req.body.mode;
  var eventName    = req.body.eventName;
  var eventTime    = req.body.eventTime;
  var destination  = req.body.destination;
  var earlyArrival = req.body.earlyArrival;

  // TODO: determine username on client side ? or sessions?
  var username = 'Liam';

  new User({ username: username })
    .fetch()
    .then(function(user) {
      var newEvent = new Event({
        userId: user.get('id'),
        mode: mode,
        eventName: eventName,
        eventTime: eventTime,
        destination: destination,
        earlyArrival: earlyArrival,
      });
      newEvent.save()
        .then(function(createdEvent) {
          console.log('Created new event');
          res.status(201).send(createdEvent);
        })
        .catch(function(err) {
          console.error('Could not create new event: ', err);
          res.send(500, err);
        });
    })
    .catch(function(err) {
      console.error('Could not create new event: ', err);
      res.send(500, err);
    });
};

exports.updateUserLocation =  function(req, res) {
  var userId = req.params.id;
  var origin = req.body.origin;

  new User({ id: userId })
    .fetch()
    .then(function(user) {
      user.set('origin', origin);
      user.save()
        .then(function(updatedUser) {
          Event.fetchAll({ where: { userId: userId }})
            .then(function(events) {
              if (events.length !== 0) {
                events.forEach(function(event) {
                  googleWorker(event.attributes, updatedUser.attributes.origin);
                });
                updatedUser.clearWatch = false;
                console.log('Called worker for each scheduled event');
                res.status(201).send({clearWatch: false, updatedUser: updatedUser});
              } else {
                console.log("No events scheduled");
                updatedUser.clearWatch = true;
                res.status(201).send({clearWatch: true, updatedUser: updatedUser});
              }
            });
        });
    })
    .catch(function(err) {
      console.error('Could not find user in database: ', err);
      res.status(404).send(err);
    });
};

exports.getAllUserEvents = function(req, res) {
  var userId = req.params.id;

  Event.fetchAll({where: { userId: userId }})
    .then(function(events) {
      console.log('Got all user\'s events for event list');
      res.send(events);
    })
    .catch(function(err) {
      console.error('Could not get all user\'s events for event list', err);
      res.status(404).send(err);
    });
};

exports.login = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  // compare to db
  new User({ username: username })
    .fetch()
    .then(function(user) {
      if (user) {
        bcrypt.compare(password, user.get('password'), function(err, match) {
          if (match) {
            // log the user in!
          } else {
            console.log('That password was incorrect');
          }
        });
      } else {
        // user was not found... we could send them to the signup page, or
        // keep them on the login page.
      }
    });
};

exports.signup = function(req, res) {
  var username    = req.body.username;
  var password    = req.body.password;
  var phoneNumber = '+1' + req.body.password; // Add +1 to beggining for use with twilio
  // check username against db to avoid duplicate users
  new User({ username: username })
    .fetch()
    .then(function(found) {
      if (found) {
        console.log('Sorry, that username is already in the database!');
      } else {
        // if we decide to use a salt, we pass it in instead of null
        bcrypt.hash(password, null, function(err, hashedPassword){
          User.create({
            username: username,
            password: hashedPassword,
            phoneNumber: phoneNumber
          })
          .then(function(user) {
            // this is where we create a session or execute whatever action
            // needs to take place after a user is successfully created.
          });
        });
      }
    });
};
