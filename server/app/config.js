var path = require('path');
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../db/hurryup.sqlite')
  }
});
var db = require('bookshelf')(knex);

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function(user) {
      user.increments('id').primary();
      user.string('username', 20).unique();
      user.string('password', 20);
      user.string('phoneNumber', 20);
      user.string('origin', 100);
    }).then(function(table) {
      console.log('Created User Table', table);
    });
  }
});

db.knex.schema.hasTable('events').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('events', function(event) {
      event.increments('id').primary();
      event.string('eventName', 20);
      event.string('eventTime', 20);
      event.string('address', 100);
      event.string('city', 100);
      event.string('state', 20);
      event.string('earlyArrival', 20);
      event.string('mode', 30);
      event.string('twilioSent', 30);
      event.integer('duration');
      event.integer('userId');
    }).then(function(table) {
      console.log('Created Event Table', table);
    });
  }
});

module.exports = db;
