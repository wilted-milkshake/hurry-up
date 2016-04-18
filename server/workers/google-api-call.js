var request    = require('request');
var API_KEYS   = require('../api_keys.js');
var TwilioSend = require('./twilio-api-call.js');

// note: in-memory storage ? write to db?  ...for clearing timeouts
var events = {};

var googleWorker = function(event, origin, phoneNumber) {
  // TODO: parse eventtime and earlyarrival to manipulate milliseconds // validate user form entry
  // var arrivalTime = event.eventTime (convert to UTC sec) - event.earlyArrival (convert to UTC sec);
  var arrivalTime  = Date.now()/1000;     //seconds
  var currentTime  = Date.now()/1000;     //seconds

    //split into each field
  var originLat    = origin.latitude;     //37.773972
  var originLong   = origin.longitude;    //-122.431297
  //'1118FolsomStreet,SanFrancisco,CA' Doesnt actually need spaces removed, but regex practice is nice;
  var eventAddress = event.address.replace(/\s/g, '') + event.city.replace(/\s/g, '') + event.state;
  var travelMode   = event.mode;          //'driving';

  // Get routes time duration from Google API
  var apiRequest   = 'https://maps.googleapis.com/maps/api/directions/json?' +
    'origin=' + originLat + ',' + originLong +
    '&destination=' + eventAddress +
    '&mode=' + travelMode +
    '&key=' + API_KEYS.googleAPI;

  request(apiRequest, function(err, res, body) {
    var parsedBody = JSON.parse(body);
    if (err || !parsedBody.routes[0]) { console.log('There was an error with Google API', err); }
    else {
      var duration = parsedBody.routes[0].legs[0].duration.value;
      var timeoutDuration = (arrivalTime - duration) - currentTime;
      if (timeoutDuration < 0) {
        timeoutDuration = 0;
      }
      if (events[event.id]) {
        clearTimeout(events[event.id]);
      }
      //send twilio third parameter ultimately will be ( duration + early arrival) to delete when the event starts, now just hardcoded to delete after 5 sec.)
      events[event.id] = setTimeout(function() { TwilioSend('+19258726914', event, 5000); }, timeoutDuration*1000);
    }
  });
};

module.exports = googleWorker;


