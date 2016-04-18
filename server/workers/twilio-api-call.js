var Keys   = require('../api_keys.js');
var Event  = require('../app/models/event.js');
//require the Twilio module and create a REST client
var client = require('twilio')(Keys.twilioAccountSid, Keys.twilioAuthToken);

var sendText = function(userPhoneNumber, event, timeoutTime) {
  //send twilio text
  client.sendMessage({
      to: userPhoneNumber,  // Any number Twilio can deliver to
      from: '+12673544918', // TO TEST:'+15005550006', //Ranes Tiwilio # '+12673544918' //Liams Twilio #'+17346362216', // A number you bought from Twilio
      body: 'Hurry Up! Leave now to get to ' + event.eventName + ' by ' + event.eventTime // body of the SMS message
  }, function(err, responseData) { //this function is executed when a response is received from Twilio
      if (err) {
        console.log("Error sending Twilio text", err);
      } else {
          console.log(responseData.from); // outputs "+14506667788"
          console.log(responseData.body); // outputs "word to your mother."
      }
  });

  //delete event from database after it starts
  setTimeout(function() {
    new Event({id: event.id})
      .destroy()
      .then(function(model) {
        console.log('Event has been destroyed', model);
      })
      .catch(function(err) {
        console.log(err);
      });
  }, timeoutTime);
};

module.exports = sendText;
