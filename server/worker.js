var request = require('request');
var API_KEY = require('./api_keys.js');

var worker = function(event, responseToClient) {
  // var arrivalTime = event.eventTime - event.earlyArrival;
  // var currentTime = new Date();
  // var timeLeft = arrivalTime - currentTime;

  var timeLeft = 1200;

  var apiRequest = 'https://maps.googleapis.com/maps/api/directions/json?origin=1118FolsomStreet,SanFrancisco,CA&destination=PaloAlto&key=' + API_KEY;

  request(apiRequest, function(err, res, body) {
    if (err) { 
      console.error(err); 
    } else {
      var parsedBody = JSON.parse(body);
      var duration = parsedBody.routes[0].legs[0].duration.value;

      if (duration > timeLeft) {
        // TODO: send Twilio 'leave you're late'
        console.log('WORKER SAYS: Youre gonna be late: ', duration);
        if (responseToClient) { responseToClient.send(200, true) };
      } else if (duration > timeLeft - 300) { 
        // TODO: send Twilio 'leave now ' text
        if (responseToClient) { responseToClient.send(200, true) };
      } else {
        if (responseToClient) { responseToClient.send(200, false) };
      }
    }
  });
};

module.exports = worker;
