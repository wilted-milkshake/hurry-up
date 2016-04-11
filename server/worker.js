var request = require('request');
var API_KEYS = require('./api_keys.js');
var Event = require('./app/models/event.js');

// note: in-memory storage ? write to db?
var events = {};

var worker = function(event, origin, responseToClient) {
  // TODO: parse eventtime and earlyarrival to manipulate milliseconds // validate user form entry


  // var arrivalTime = event.eventTime (convert to UTC sec) - event.earlyArrival (convert to UTC sec);
  var arrivalTime = Date.now()/1000 + 600; //seconds
  var currentTime = Date.now()/1000; //seconds

  var originLat = origin.latitude; //37.773972
  var originLong = origin.longitude; //-122.431297
  var eventAddress = event.destination; //'1118FolsomStreet,SanFrancisco,CA';
    //split into each field
  var travelMode = event.mode;   //'driving';

  // 1. get API directions time duration
  var apiRequest = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + originLat + ',' + originLong + '&destination=' + eventAddress +  '&mode=' + travelMode + '&key=' + API_KEYS.googleAPI;

  request(apiRequest, function(err, res, body) {
    if (err) { throw err; }
    var parsedBody = JSON.parse(body);
    var duration = parsedBody.routes[0].legs[0].duration.value;
    var timeoutDuration = (arrivalTime - duration) - currentTime;
    if (timeoutDuration < 0) {
      timeoutDuration = 0;
    }
    if (events[event.id]) {
      clearTimeout(events[event.id]);
    }
    events[event.id] = setTimeout(function() { sendTwilio(event, 5000); }, timeoutDuration*1000);  //send twilio second parameter ultimately will be ( duration + early arrival to delete when the event starts)
    // TODO: responseToClient.send(200, true)
  });
};

var sendTwilio = function(event, timeoutTime) {
  console.log('Twilio text - leave now to get to ' + event.eventName + ' by ' + event.eventTime);
  //after event is sent, delete record from table

  // Set another timeout after message sent to delete event from database after event starts
  setTimeout(function() {
    new Event({id: event.id})
    .destroy()
    .then(function(model) {
      console.log('Should be destroyed', model);
    })
    .catch(function(err) {
      console.log(err);
    });
  }, timeoutTime);

};

module.exports = worker;
