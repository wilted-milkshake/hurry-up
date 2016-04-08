var app = require('./server-config.js');
// var utility = require('./herlp.js');

// app.get()

app.post('/api/event', function(req, res) {
  //1. parse out req.body data
  var eventName = req.body.data.eventName; 
  var eventTime = req.body.data.eventTime;
  var eventLocation = req.body.data.eventLocation;
  var arrivalMargin = req.body.data.arrivalMargin;
  var transportMode = req.body.data.transportMode;
  // TODO: determine username on client side ? or sessions?
  var username = req.body.data.username;

  //2. write data to db
  // TODO: double check fetch-where query
  Users.fetch({ username: username })
    .then(function(user) {
      var newEvent = new Event({
        eventName: eventName,
        eventTime: eventTime,
        eventLocation: eventLocation,
        arrivalMargin: arrivalMargin,
        transportMode: transportMode,
        username: user.get('id')
      });
      newEvent.save()
        .then(function(createdEvent) {
          res.send(201, 'OK'); //TODO: check status code for POST
        })
        .catch(function(err) {
          res.send(/*unsuccessful post*/);
        });
    })
    .catch(function(err) {
      res.send(/* user does not exist*/);
    });
});


module.exports = app;
