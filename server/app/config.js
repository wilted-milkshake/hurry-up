var path = require('path');
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../db/hurryup.sqlite')
  }
});
var db = require('bookshelf')(knex);
