/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight
} from 'react-native';

import Form from 'react-native-form';

import {sendEvent, updateLocation} from './helpers/request-helpers';

//import Location from 'react-native-location';

class hurryup extends Component {

  constructor(props) {
    super(props);


  this.watchID = null;

  this.state = {
      initialPosition: 'unknown',
      lastPosition: 'unknown',
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      var initialPosition = position;
      this.setState({initialPosition});
    },
    (error) => alert(error.message),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
  }

  buttonClicked() {
    var newEvent = this.refs.form.getValues();
    var origin = this.state.initialPosition.coords;
    sendEvent(newEvent);
    updateLocation(origin);

    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = position;
      this.setState({lastPosition});
      console.log('>>>>>>>>Client-side INITIAL POSITION: ', this.state.initialPosition);
      console.log('>>>>>>>>Client-side LAST POSITION: ', this.state.lastPosition);

      var initialPosition = this.state.initialPosition;
      var initialLatitude = initialPosition.coords.latitude;
      var initialLongitude = initialPosition.coords.longitude;
      var lastLatitude = lastPosition.coords.latitude;
      var lastLongitude = lastPosition.coords.longitude;

      var distanceTraveled = Math.sqrt(Math.pow((initialLatitude - lastLatitude), 2) + Math.pow((initialLongitude - lastLongitude), 2));

      if (distanceTraveled >= 0.004) {
        updateLocation(this.state.lastPosition.coords);
        this.setState({ initialPosition: lastPosition });
      } 
    },
    (error) => alert(error.message),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 60000});

    // navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    return (
      <View style={styles.container}>
        <Form ref='form'>
          <Text style={styles.welcome}>
            Hurry Up!
          </Text>

          <Text style={styles.instructions}>
            Your Event:
          </Text>
          <View>
            <TextInput
              style={styles.eventName}
              type='TextInput'
              name="eventName"
              placeholder='Cool Party'/>
          </View>

          <Text style={styles.instructions}>
            Event Location:
          </Text>
          <View>
            <TextInput
              style={styles.eventName}
              type='TextInput'
              name="destination"
              placeholder='SomePlace'/>
          </View>

          <Text style={styles.instructions}>
            Event Time:
          </Text>
          <View>
            <TextInput
              style={styles.eventName}
              type='TextInput'
              name="eventTime"
              placeholder='1800'/>
          </View>

          <Text style={styles.instructions}>
            How Early Do You Want To Get There:
          </Text>
          <View>
            <TextInput
              style={styles.eventName}
              type='TextInput'
              name="earlyArrival"
              placeholder='5 min'/>
          </View>

          <Text style={styles.instructions}>
            How Are You Getting There:
          </Text>
          <View>
            <TextInput
              style={styles.eventName}
              type='TextInput'
              name="mode"
              placeholder='driving, transit, walking' />
          </View>
        </Form>

        <TouchableHighlight
          style={styles.button}
          onPress={this.buttonClicked.bind(this)}>
          <View>
            <Text style={styles.buttonText}>Submit!</Text>
          </View>
        </TouchableHighlight>


      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00b37a',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
    eventName: {
      backgroundColor: 'white',
      color: 'black',
      height: 40,
      borderColor: 'black',
      borderWidth: 1,
      width: 200
  },
});

AppRegistry.registerComponent('hurryup', () => hurryup);
