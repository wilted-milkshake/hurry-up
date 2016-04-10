var request = require('request');
var API_KEY = require('./api_keys.js'); 

// note: in-memory storage ? write to db?
var events = {};

var worker = function(event, responseToClient) {
  // TODO: parse eventtime and earlyarrival to manipulate milliseconds // validate user form entry
  // var arrivalTime = event.eventTime - event.earlyArrival;
  console.log('worker event: ', event);
  var arrivalTime = 1460325360287;
  var currentTime = Date.now();
  console.log('Worker called!');
  
  // 1. get API directions time duration
  var apiRequest = 'https://maps.googleapis.com/maps/api/directions/json?origin=1118FolsomStreet,SanFrancisco,CA&destination=PaloAlto&key=' + API_KEY;

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
}

module.exports = worker;
