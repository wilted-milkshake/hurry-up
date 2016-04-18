# hurry-up

The goal of hurry-up is to make sure you are never late to an appointment again. hurry-up allows users to save an appointment and receive a text message reminder when they should leave, based on wherever their location happens to be at that time.

## Setup

1.) Install all dependencies (there are many!) - run `npm install`
2.) To run the server - from the root directory do `nodemon server/server.js`

#### Client-side specifics
1.) To open the project in Xcode, do `open ios/hurryup.xcodeproj`
2.) Click 'Build and Run' to open the application in the simulator
3.) To change the simulated location, go to Debug -> Location -> (choose option)
4.) This application has only been tested on iPhone 5 and 6 models. Visual elements will not display correctly on older models.

## API's

This project will require developer accounts for two API's: Google for location information, and Twilio to send text messages to users. It should be noted that each trial Twilio account allows texting to a single phone number. Each team member might need to create a separate account for testing purposes.

Once you have created the necessary developer accounts, you will need to create a file called `api-keys.js` within the `server` directory (this file should already be git ignored). This file -- which is required in several places in the back end -- should contain the following information:

```javascript
var API_KEYS = {
 googleAPI: /* INSERT HERE */,
 twilioAccountSid: /* INSERT HERE */,
 twilioAuthToken: /* INSERT HERE */
};
module.exports = API_KEYS;
```

## Tech Stack

The client side is written entirely in React Native for iOS. The server is written in Node Express and uses the Sqlite database engine, along with the Bookshelf.js ORM and Knex SQL query builder. 
