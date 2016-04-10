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

export const updateLocation = (origin) => {
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
  .then((response) => console.log('PUT response: ', response))
  .catch((error) => {
    console.warn('Unable to send phone location', error);
  });
};
