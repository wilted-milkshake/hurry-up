var request = require('request');
var API_KEYS = require('./api_keys.js');
var Event = require('./app/models/event.js');

// note: in-memory storage ? write to db?
var events = {};

var worker = function(event, origin, responseToClient) {
  // TODO: parse eventtime and earlyarrival to manipulate milliseconds // validate user form entry


  // var arrivalTime = event.eventTime (convert to UTC sec) - event.earlyArrival (convert to UTC sec);
  var arrivalTime = Date.now()/1000 + 600; //seconds
  var currentTime = Date.now()/1000; //seconds

  var originLat = origin.latitude; //37.773972
  var originLong = origin.longitude; //-122.431297
  var eventAddress = event.destination; //'1118FolsomStreet,SanFrancisco,CA';
    //split into each field
  var travelMode = event.mode;   //'driving';

  // 1. get API directions time duration
  var apiRequest = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + originLat + ',' + originLong + '&destination=' + eventAddress +  '&mode=' + travelMode + '&key=' + API_KEYS.googleAPI;

  request(apiRequest, function(err, res, body) {
    if (err) { throw err; }
    var parsedBody = JSON.parse(body);
    var duration = parsedBody.routes[0].legs[0].duration.value;
    var timeoutDuration = (arrivalTime - duration) - currentTime;
    if (timeoutDuration < 0) {
      timeoutDuration = 0;
    }
    if (events[event.id]) {
      clearTimeout(events[event.id]);
    }
    events[event.id] = setTimeout(function() { sendTwilio(event); }, timeoutDuration*1000);
    // TODO: responseToClient.send(200, true)
  });
};

var sendTwilio = function(event) {
  console.log('Twilio text - leave now to get to ' + event.eventName + ' by ' + event.eventTime);
  //after event is sent, delete record from table

  console.log("EVENT", event, event.id);

  new Event({id: event.id})
  .destroy()
  .then(function(model) {
    console.log('Should be destroyed', model);
  })
  .catch(function(err) {
    console.log(err);
  });

  //OTHERs maybe
  // Event.forge({id: event.id})
  // .fetch()
  // .then(function (item) {
  //   var relation = item.someRelation();
  //   var tableName = relation.relatedData.targetTableName;
  //   var foreignKey = relation.relatedData.key('foreignKey');

  //   return Bookshelf.DB.knex('events')
  //   .where(id, event.id)
  //   .del()
  //   .then(function (numRows) {
  //     console.log(numRows + ' rows have been deleted');
  //   }).catch(function (err) {
  //     console.log(err);
  //   });
// });
};

module.exports = worker;
