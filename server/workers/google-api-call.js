var request    = require('request');
var API_KEYS   = require('../api_keys.js');
var TwilioSend = require('./twilio-api-call.js');
var Event      = require('../app/models/event.js');
var User       = require('../app/models/user.js');
var moment     = require('moment');

moment().format();
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
      event.save()
        .then(function(updatedEvent) {
          // console.log('Updated duration for event: ', updatedEvent);
        })
        .catch(function(err) {
          console.log('Error updating duration for event: ', err);
        });
    })
};

var addRecurringEvent = function(event, eventTime) {
  var userId       = event.userId;
  var mode         = event.mode;
  var repeat       = event.repeat;
  var eventName    = event.eventName;
  var address      = event.address;
  var city         = event.city;
  var state        = event.state;
  var earlyArrival = event.earlyArrival;
  var eventTime    = eventTime;

  new User({ id: userId })
    .fetch()
    .then(function(user) {
      var newEvent = new Event({
        userId: user.get('id'),
        mode: mode,
        repeat: repeat,
        eventName: eventName,
        eventTime: eventTime,
        address: address,
        city: city,
        state: state,
        twilioSent: 'false',
        earlyArrival: earlyArrival,
      });
      newEvent.save()
        .then(function(createdEvent) {
          console.log('Created new recurring event: ', createdEvent);
          // res.status(201).send(createdEvent);
        })
        .catch(function(err) {
          console.error('Could not create new recurring event 1: ', err);
          // res.status(500).send(err);
        });
    })
    .catch(function(err) {
      console.error('Could not create new recurring event 2: ', err);
      // res.status(500).send(err);
    });
};

var setRecurringEventTime = function(event) {
  var time, newEventTime;

  if (event.repeat === 'Daily') {
    time = moment(event.eventTime).add(1, 'day').format('ddd MMM D YYYY k:mm:ss');
    newEventTime = time + ' GMT-0700 (PDT)'; 
  } else if (event.repeat === 'Weekly') {
    time = moment(event.eventTime).add(1, 'day').format('ddd MMM D YYYY k:mm:ss');
    newEventTime = time + ' GMT-0700 (PDT)';
  } else if (event.repeat === 'Monthly') {
    time = moment(event.eventTime).add(1, 'day').format('ddd MMM D YYYY k:mm:ss');
    newEventTime = time + ' GMT-0700 (PDT)';
  }

  addRecurringEvent(event, newEventTime);
  
  // switch(event.repeat) {
  //   case 'Never':
  //     break;
  //   case 'Daily':
  //     console.log('NEW TIME >>>>>> ', newEventTime);
  //     break;
  //   case 'Weekly': 
  //     addRecurringEvent(event, newEventTime);
  //     break;
  //   case 'Monthly':
  //     addRecurringEvent(event, newEventTime);
  //     break;
  // }
};

var googleWorker = function(event, origin, phoneNumber) {
  // TODO: parse eventtime and earlyarrival to manipulate milliseconds // validate user form entry
  // var arrivalTime = event.eventTime (convert to UTC sec) - event.earlyArrival (convert to UTC sec);
  // Date.parse() converts time in string into milliseconds
  var arrivalTime  = Date.parse(event.eventTime)/1000 - event.earlyArrival;
  var currentTime  = Date.now()/1000;     //seconds

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
      var duration = parsedBody.routes[0].legs[0].duration.value; // travel time
      var timeoutDuration = (arrivalTime - duration) - currentTime;
      if (timeoutDuration < 0) {
        timeoutDuration = 0;
      }
      if (events[event.id]) {
        clearTimeout(events[event.id]);
      }

      // save duration in database
      saveDuration(event, duration);

      // send text to phone number
      events[event.id] = setTimeout(function() {
        TwilioSend(phoneNumber, event, duration + event.earlyArrival);

        if (event.repeat !== 'Never') {
          setRecurringEventTime(event); // if event is set to repeat, re-add event to database
        }
        
        // var test = moment(event.eventTime).add(1, 'day').format('ddd MMM D YYYY, k:mm:ss') + ' GMT-0700 (PDT)';
        // moment converts to milliseconds
        // delete
        // console.log('TESTING MOMENT >>>', test);
        // TESTING MOMENT >>> { [Number: 1461204074000]
        //   _isAMomentObject: true,
        //   _i: 'Wed Apr 20 2016 19:01:14 GMT-0700 (PDT)',
        //   _isUTC: false,


        alreadySentTwilio(event);
      }, timeoutDuration*1000);
    }
  });
};

module.exports = {
  googleWorker: googleWorker,
  events: events
};
