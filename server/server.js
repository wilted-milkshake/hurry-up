var app = require('./router.js');

//console.log('Hurry-up is listening on 8080');

app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



