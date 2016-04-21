var Keys   = require('../api_keys.js');
var Event  = require('../app/models/event.js');
var User       = require('../app/models/user.js');
var moment     = require('moment');
// moment().format();

//require the Twilio module and create a REST client
var client = require('twilio')(Keys.twilioAccountSid, Keys.twilioAuthToken);

var displayTime = function(time) {
  var dateString = time.toString();
  var hours = dateString.substring(16,18);
  var postfix;
  if (Number(hours) > 12) {
    postfix = 'PM';
    hours = hours - 12;
  } else {
    postfix = 'AM';
  }
  var minutes = dateString.substring(19,21);
  return hours + ':' + minutes + ' ' + postfix;
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
  console.log('setRecurringEventTime is called!!!!!');
  var time, newEventTime;

  if (event.repeat === 'Daily') {
    time = moment(event.eventTime).add(1, 'day').format('ddd MMM D YYYY k:mm:ss');
    newEventTime = time + ' GMT-0700 (PDT)'; 
  } else if (event.repeat === 'Weekly') {
    time = moment(event.eventTime).add(1, 'week').format('ddd MMM D YYYY k:mm:ss');
    newEventTime = time + ' GMT-0700 (PDT)';
  } else if (event.repeat === 'Monthly') {
    time = moment(event.eventTime).add(1, 'month').format('ddd MMM D YYYY k:mm:ss');
    newEventTime = time + ' GMT-0700 (PDT)';
  }

  addRecurringEvent(event, newEventTime);
};


var sendText = function(userPhoneNumber, event, timeoutTime) {
  var eventTime = displayTime(event.eventTime);
  const { eventName, state, mode, repeat } = event;
  const address = event.address.replace(/\s/g, '+');
  const city = event.city.replace(/\s/g, '+');
  //send twilio text
  client.sendMessage({
      to: userPhoneNumber,
      from: '+14156894189', // connie: '+14156894189'
      body:`Hurry Up! Leave now to get to ${eventName} by ${eventTime}. Click here to get directions: http://maps.apple.com/?daddr=${address}+${city}+${state}&dirflg=d&t=m`
    }, function(err, responseData) { //this function is executed when a response is received from Twilio
      if (err) {
        console.log("Error sending Twilio text", err);
      } else {
        console.log(responseData.from); // outputs "+14506667788"
        console.log(responseData.body); // outputs "word to your mother."
      }
    }
  );
  
  //archive event in database after it starts
  console.log('eventTime >>>>>', event.eventTime);
  console.log('new Date().getTime() >>>>>', new Date().getTime());
  var time = parseInt(Date.parse(event.eventTime) - (new Date().getTime()))
  console.log('time >>>>>', time);
  setTimeout(function() {
    console.log('setTimeout is invoked!!!!!');
    new Event({id: event.id})
      .fetch()
      .then(function(event) {
        event.set('hasOccured', 'true')
      })
      .catch(function(err) {
        console.log(err);
      });

    // if event is set to repeat, re-add event to database
    if (event.repeat !== 'Never') {
      setRecurringEventTime(event); 
    }
  }, time);
}


module.exports = sendText;
