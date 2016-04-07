var db = require('../config.js');
var User = require('./user.js');

var Event = db.Model.extend({
  tableName: 'events',
  users: function() {
    return this.belongsToMany(User);
  }
});

module.exports = Event;
