var request = require('request');
var API_KEY = require('./api_keys.js');

// note: in-memory storage ? write to db?
var events = {};

var worker = function(event, origin, responseToClient) {
  // TODO: parse eventtime and earlyarrival to manipulate milliseconds // validate user form entry
  // var arrivalTime = event.eventTime - event.earlyArrival;
  console.log('worker origin: ', origin);
  var arrivalTime = 1460325360287;
  var currentTime = Date.now();
  console.log('Worker called!');

  var eventAddress = '1118FolsomStreet,SanFrancisco,CA';
  var originCoords =  '37.773972,-122.431297'; //'PaloAlto';
  var travelMode = 'driving';

  // 1. get API directions time duration
  var apiRequest = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + originCoords + '&destination=' + eventAddress +  '&mode=' + travelMode + '&key=' + API_KEY;
  request(apiRequest, function(err, res, body) {
    if (err) { throw err; }
    var parsedBody = JSON.parse(body);
    var duration = parsedBody.routes[0].legs[0].duration.value;
    var timeoutDuration = (arrivalTime - duration*1000) - currentTime;
    if (timeoutDuration < 0) {
      timeoutDuration = 0;
    }
    if (events[event.id]) {
      clearTimeout(events[event.id]);
    }
    events[event.id] = setTimeout(function() { sendTwilio(event); }, timeoutDuration/1000);
    // TODO: responseToClient.send(200, true)
  });
};

var sendTwilio = function(event) {
  console.log('Twilio text - leave now to get to ' + event.eventName + ' by ' + event.eventTime);
};

module.exports = worker;
