var React = require('react-native'),
    window = global || window;

window.React = React;
//importing extra folers https://github.com/facebook/react-native/issues/740

var sendEvent = (values) => {
  fetch('http://localhost:8080/api/events' , {
    method: 'POST' ,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })
  .then((response) => console.log(response))
  .catch((error) => {
    console.warn('Unable to send event', error);
  });
};


window.sendEvent = sendEvent;
