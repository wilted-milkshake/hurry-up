var app = require('./router.js');

console.log('Hurry-up is listening on 8080');

// Twilio Credentials
var accountSid = 'ACdb8157df25c232242bf29813de83c0d9';
var authToken = '8de5aef449d5bac36d44357500be1c33';

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);

//Send an SMS text message
client.sendMessage({

    to: '7347550839', // Any number Twilio can deliver to
    from: '+17346362216', // A number you bought from Twilio and can use for outbound communication
    body: 'Hurry Up! Here are your directions: ' // body of the SMS message

}, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (!err) { // "err" is an error received during the request, if any

        // "responseData" is a JavaScript object containing data received from Twilio.
        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

        console.log(responseData.from); // outputs "+14506667788"
        console.log(responseData.body); // outputs "word to your mother."

    }
});

app.listen(8080);
