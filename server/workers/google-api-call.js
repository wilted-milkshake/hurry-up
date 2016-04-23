var request    = require('request');
var API_KEYS   = require('../api_keys.js');
var TwilioSend = require('./twilio-api-call.js');
var Event      = require('../app/models/event.js');
// var moment     = require('moment');
// var route      = require('../router/route-helper.js');

// note: in-memory storage ? write to db?  ...for clearing timeouts

var events = {};

var alreadySentTwilio = function(event) {
  new Event({ id: event.id })
    .fetch()
    .then(function(event) {
      event.set('twilioSent', 'true');
      event.save()
        .then(function(updatedEvent) {
          // console.log('Changed twilioSent for event: ', updatedEvent);
        })
        .catch(function(err) {
          console.log('Error updated twilioSent for event ', err);
        });
      });
};

var saveDuration = function(event, duration) {
  new Event({ id: event.id })
  .fetch()
  .then(function(event) {
    event.set('duration', duration);
    return event.save();
  })
  .then(function(updatedEvent) {
    console.log('Updated duration for event: ', updatedEvent);
  })
  .catch(function(err) {
    console.log('Error updating duration for event: ', err);
  });
};

var googleWorker = function(event, origin, phoneNumber) {
  // TODO: parse eventtime and earlyarrival to manipulate milliseconds // validate user form entry
  // var arrivalTime = event.eventTime (convert to UTC sec) - event.earlyArrival (convert to UTC sec);
  // Date.parse() converts time in string into milliseconds

  var arrivalTime  = Date.parse(event.eventTime)/1000 - parseInt(event.earlyArrival); // in seconds
  var currentTime  = Date.now()/1000; // in seconds

    //split into each field
  var originLat    = origin.latitude;     //37.773972
  var originLong   = origin.longitude;    //-122.431297
  //'1118FolsomStreet,SanFrancisco,CA' Doesnt actually need spaces removed, but regex practice is nice;
  var eventAddress = event.address.replace(/\s/g, '') + event.city.replace(/\s/g, '') + event.state;
  var travelMode   = event.mode.toLowerCase();          //'driving';

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
      var duration = parsedBody.routes[0].legs[0].duration.value; // travel time in seconds

      var sendTextTimeout = (arrivalTime - duration) - currentTime; // duration, event.earlyArrival are strings, also in seconds
      var archiveEventTimeout = parseInt(duration) + parseInt(event.earlyArrival);
      
      if (sendTextTimeout < 0) {
        sendTextTimeout = 1; // hacky fix: set to 1 instead of 0 so that duration time shows up for all events
        archiveEventTimeout = arrivalTime + parseInt(event.earlyArrival) - currentTime;
      }

      // console.log('duration: ', duration);
      // console.log('sendTextTimeout: ', sendTextTimeout);
      // console.log('archiveEventTimeout: ', archiveEventTimeout);

      if (events[event.id]) {
        clearTimeout(events[event.id]);
      }

      // save duration in database
      saveDuration(event, duration);

      // send text to phone number
      events[event.id] = setTimeout(function() {
        TwilioSend(phoneNumber, event, archiveEventTimeout*1000);
        alreadySentTwilio(event);
      }, sendTextTimeout*1000);
    }
  });
};

module.exports = {
  googleWorker: googleWorker,
  events: events
};
