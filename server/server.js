var app = require('./router.js');

// require routes 


// create new user:
// new User({ username: , password: , phoneNumber: }).save()

// create new event:
// fetch User where username=currentuser
  // new Event({ all event data, userId: user.get('id') }).save();

// fetch all events from currUser
  // new Event({ userId: currUser.id }).fetch()



console.log('Hurry-up is listening on 8080');
app.listen(8080);
