var db    = require('../config.js');
var Event = require('./event.js');

var User  = db.Model.extend({
  tableName: 'users',
  events: function() {
    return this.hasMany(Event);
  }
});

module.exports = User;
