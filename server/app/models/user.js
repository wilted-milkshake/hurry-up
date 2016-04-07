var db = require('../config.js');
var Event = require('./event.js');

var User = db.Model.extend({
  tableName: 'users',
  events: function() {
    return this.belongsToMany(Event);
  }
});

// var newUser = new User({
//   username: 'cat',
//   password: 'kitty'
// });
// newUser.save();

module.exports = User;
