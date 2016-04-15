import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Image,
  Dimensions,
  Animated,
  PickerIOS
} from 'react-native';

import Picker from './picker';
import {sendEvent, updateLocation} from '../helpers/request-helpers';

const deviceWidth       = Dimensions.get('window').width;
const deviceHeight      = Dimensions.get('window').height;
const earlyArrivalTimes = [{time: '5 minutes', value: 300},{time: '10 minutes', value: 600},{time: '15 minutes', value: 900}, {time: '20 minutes', value: 1200}];
const DISTANCE_TO_REFRESH = 0.004;

class CreateEvent extends Component {

  constructor(props) {
    super(props);

    this.watchID = null;

    this.state = {
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      eventName: '',
      eventTime: '',
      destination: '',
      earlyArrivalIndex: 0,
      mode: '',
      offSet: new Animated.Value(deviceHeight),
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      var initialPosition = position;
      this.setState({ initialPosition });
    },
    (error) => alert(error.message),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
  }

  changeEarlyArrival(earlyArrivalIndex) {
    this.setState({ earlyArrivalIndex });
  }

  clearForm() {
    this.setState({
      eventName: '',
      eventTime: '',
      destination: '',
      earlyArrivalIndex: 0,
      mode: '',
      modal: false,
    });
  }

  buttonClicked() {
    var newEvent  = {
      eventName: this.state.eventName,
      eventTime: this.state.eventTime,
      destination: this.state.destination,
      earlyArrival: earlyArrivalTimes[this.state.earlyArrivalIndex].value,
      mode: this.state.mode,
    };
    this.clearForm();
    var origin    = this.state.initialPosition.coords;
    sendEvent(newEvent);
    updateLocation(origin);

    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = position;
      this.setState({ lastPosition });

      var initialPosition   = this.state.initialPosition;
      var initialLatitude   = initialPosition.coords.latitude;
      var initialLongitude  = initialPosition.coords.longitude;
      var lastLatitude      = lastPosition.coords.latitude;
      var lastLongitude     = lastPosition.coords.longitude;

      var distanceTraveled  = Math.sqrt(Math.pow((initialLatitude - lastLatitude), 2) + Math.pow((initialLongitude - lastLongitude), 2));

      var that = this;

      if (distanceTraveled >= DISTANCE_TO_REFRESH) {
        updateLocation(this.state.lastPosition.coords, that);
        this.setState({ initialPosition: lastPosition });
      }
    },
    (error) => alert(error.message),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 60000});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputsContainer}>

          <View style={styles.inputContainer}>
            <TextInput 
              style={[styles.inputFormat, styles.inputStyle]}
              placeholder="Event Name"
              placeholderTextColor="#F5F5F6"
              value={this.state.eventName}
              onChangeText={(eventName) => this.setState({eventName})}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput 
              style={[styles.inputFormat, styles.inputStyle]}
              placeholder="Event Location"
              placeholderTextColor="#F5F5F6"
              value={this.state.destination}
              onChangeText={(destination) => this.setState({destination})}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput 
              style={[styles.inputFormat, styles.inputStyle]}
              placeholder="Event Time"
              placeholderTextColor="#F5F5F6"
              value={this.state.eventTime}
              onChangeText={(eventTime) => this.setState({eventTime})}
            />
          </View>

          <View style={styles.inputContainer}>
            <TouchableHighlight style={styles.inputFormat} underlayColor="transparent" onPress={ () => this.setState({modal: true}) }>
              <Text style={styles.inputStyle}>Early Arrival -- {earlyArrivalTimes[this.state.earlyArrivalIndex].time}</Text>
            </TouchableHighlight>
            { this.state.modal ? <Picker closeModal={() => this.setState({ modal: false })} offSet={this.state.offSet} changeEarlyArrival={this.changeEarlyArrival.bind(this)} earlyArrivalIndex={this.state.earlyArrivalIndex} /> : null } 
          </View>

          <View style={this.state.modal ? styles.hidden : styles.inputContainer}>
            <TextInput 
              style={[styles.inputFormat, styles.inputStyle]}
              placeholder="Mode of Transport"
              placeholderTextColor="#F5F5F6"
              value={this.state.mode}
              onChangeText={(mode) => this.setState({mode})}
            />
          </View>

        </View>

        <TouchableHighlight
          pointerEvents={this.state.modal ? 'none' : 'auto'}
          style={this.state.modal ? styles.hidden : styles.submitButton}
          onPress={this.buttonClicked.bind(this)}>
          <View>
            <Text style={styles.inputStyle}>Submit!</Text>
          </View>
        </TouchableHighlight>

        <View style={styles.empty}></View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  inputsContainer: {
    marginTop: 20,
    marginBottom: 10,
    flex: .75
  },
  inputContainer: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderBottomColor: '#CCC',
    borderColor: 'transparent'
  },
  inputFormat: {
    left: 35,
    top: 5,
    right: 0,
    height: 25,
  },
  inputStyle: {
    color: '#F5F5F6',
    fontSize: 16
  },
  submitButton: {
    backgroundColor: '#34778A',
    padding: 20,
    alignItems: 'center',
  },
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: .15
  },
  buttonText: {
    color: '#F5F5F6',
    fontSize: 16,
    fontFamily: 'HelveticaNeue-Light',
    textAlign: 'center',
  },
  inputs: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderBottomColor: '#F5F5F6',
    borderColor: 'transparent'
  },
  hidden: {
    opacity: 0,
  }
});


export default CreateEvent;
