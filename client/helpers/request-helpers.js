/* Use  path 104.236.147.132 instead of localhost in production mode*/

export const sendEvent = (newEvent) => {
  fetch('http://localhost:8080/api/events' , {
    method: 'POST' ,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newEvent),
  })
  .then((response) => console.log('POST response: ', response))
  .catch((error) => {
    console.warn('Unable to send event', error);
  });
};

export const updateLocation = (origin, that) => {
  // TODO: grab user id from login session(?)
  var userId = 1;

  fetch('http://localhost:8080/api/users/' + userId, {
    method: 'PUT' ,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ origin: origin }),
  })
  .then((response) => {
    var res = JSON.parse(response._bodyText);
    if (res.clearWatch) {
      navigator.geolocation.clearWatch(that.watchID);
    } else {
      console.log(res.clearWatch);
    }
    console.log('PUT response: ', response);
  })
  .catch((error) => {
    console.warn('Unable to send phone location', error);
  });
};

export const getAllEvents = () => {
  var userId = 1;
  fetch('http://localhost:8080/api/events' + userId, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then((response) => {
    console.log("GET response: ",response);
  })
  .catch((error) => {
    console.warn('Unable to get user events', error);
  });
};
