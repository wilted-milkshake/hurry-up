var db = require('../config.js');
var User = require('./user.js');

var Event = db.Model.extend({
  tableName: 'events',
  user: function() {
    return this.belongsTo(User);
  }
});

module.exports = Event;
