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
      user.increments('id')
      user.string('username', 20);
      user.string('password', 20);
      user.integer('phoneNumber', 10);
    }).then(function(table) {
      console.log('Created User Table', table);
    });
  }
});

module.exports = db;
