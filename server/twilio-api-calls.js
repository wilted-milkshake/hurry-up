// Twilio Credentials
var accountSid = 'ACdb8157df25c232242bf29813de83c0d9';
var authToken = '8de5aef449d5bac36d44357500be1c33';

// Utility object for Twilio API interactions
var Twilio = {

  //require the Twilio module and create a REST client
  client: require('twilio')(accountSid, authToken),

  sendText: function(userPhoneNumber, eventObj) {
    this.client.sendMessage({
        to: userPhoneNumber, // Any number Twilio can deliver to
        from: '+17346362216', // A number you bought from Twilio and can use for outbound communication
        body: 'Hurry Up! Here are your directions: ' // body of the SMS message
    }, function(err, responseData) { //this function is executed when a response is received from Twilio
        if (!err) {
            console.log(responseData.from); // outputs "+14506667788"
            console.log(responseData.body); // outputs "word to your mother."
        }
    });
  }
};

// Twilio.sendText('7347550839', {});  // <-- Sends a message.
module.exports = Twilio;
