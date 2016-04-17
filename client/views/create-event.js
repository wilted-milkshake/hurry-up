import React, {
  Text,
  View,
  Image,
  Animated,
  PickerIOS,
  TextInput,
  Component,
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  SegmentedControlIOS,
} from 'react-native';

import Picker from './picker';
import {sendEvent, updateLocation} from '../helpers/request-helpers';

const DISTANCE_TO_REFRESH = 0.004;
const deviceWidth         = Dimensions.get('window').width;
const deviceHeight        = Dimensions.get('window').height;
const earlyArrivalTimes   = [
  {time: '5 minutes', value: '300'},
  {time: '10 minutes', value: '600'},
  {time: '15 minutes', value: '900'},
  {time: '20 minutes', value: '1200'},
  {time: '30 minutes', value: '1800'},
  {time: '45 minutes', value: '2700'},
  {time: '1 hour', value: '3600'}
];

class CreateEvent extends Component {

  constructor(props) {
    super(props);

    this.watchID = null;

    this.state = {
      eventName: '',
      eventTime: '',
      destination: '',
      mode: 'Driving',
      earlyArrivalIndex: 0,
      lastPosition: 'unknown',
      initialPosition: 'unknown',
      offSet: new Animated.Value(deviceHeight),
      values: ['Driving', 'Walking' , 'Bicycling', 'Transit'],
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
      modal: false,
      eventName: '',
      eventTime: '',
      destination: '',
      earlyArrivalIndex: 0,
    //mode: 'Driving',        //Commented out until refresh unhighlights previous selected segment
    });
  }

  buttonClicked() {
    var newEvent  = {
      mode: this.state.mode,
      eventName: this.state.eventName,
      eventTime: this.state.eventTime,
      destination: this.state.destination,
      earlyArrival: earlyArrivalTimes[this.state.earlyArrivalIndex].value,
    };
    sendEvent(newEvent);

    this.clearForm();

    var origin   = this.state.initialPosition.coords;
    updateLocation(origin);

    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = position;
      this.setState({ lastPosition });
      var initialPosition   = this.state.initialPosition;
      var lastLatitude      = lastPosition.coords.latitude;
      var lastLongitude     = lastPosition.coords.longitude;
      var initialLatitude   = initialPosition.coords.latitude;
      var initialLongitude  = initialPosition.coords.longitude;

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

  onChange(event){
    this.setState({
      selectedIndex: event.nativeEvent.selectedSegmentIndex,
    });
  }

  onValueChange(value) {
    this.setState({
      mode: value,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputsContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Event Name"
              value={this.state.eventName}
              placeholderTextColor="#F5F5F6"
              style={[styles.inputFormat, styles.inputStyle]}
              onChangeText={(eventName) => this.setState({eventName})}/>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Event Location"
              placeholderTextColor="#F5F5F6"
              value={this.state.destination}
              style={[styles.inputFormat, styles.inputStyle]}
              onChangeText={(destination) => this.setState({destination})}/>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Event Time"
              value={this.state.eventTime}
              placeholderTextColor="#F5F5F6"
              style={[styles.inputFormat, styles.inputStyle]}
              onChangeText={(eventTime) => this.setState({eventTime})}/>
          </View>
          <View style={styles.inputContainer}>
            <TouchableHighlight
              style={styles.inputFormat}
              underlayColor="transparent"
              onPress={ () => this.setState({modal: true}) }>
              <Text style={styles.inputStyle}>
                Early Arrival -- {earlyArrivalTimes[this.state.earlyArrivalIndex].time}
              </Text>
            </TouchableHighlight>
              { this.state.modal
                ? <Picker
                  offSet={this.state.offSet}
                  earlyArrivalIndex={this.state.earlyArrivalIndex}
                  closeModal={() => this.setState({ modal: false })}
                  changeEarlyArrival={this.changeEarlyArrival.bind(this)}/>
                : null
              }
          </View>
          <View style={this.state.modal ? styles.hidden : styles.segmentedContainer}>
            <TextInput
              placeholderTextColor="#F5F5F6"
              placeholder="Mode of Transport"
              style={[styles.inputFormat, styles.inputStyle]}/>
            <View style={styles.segmentedSpacing}></View>
            <SegmentedControlIOS
              tintColor="#CCC"
              style={styles.segmented}
              values={this.state.values}
              onChange={this.onChange.bind(this)}
              onValueChange={this.onValueChange.bind(this)}/>
          </View>
        </View>
        <TouchableHighlight
          onPress={this.buttonClicked.bind(this)}
          pointerEvents={this.state.modal ? 'none' : 'auto'}
          style={this.state.modal ? styles.hidden : styles.submitButton}>
          <View>
            <Text style={styles.inputStyle}>
              Submit!
            </Text>
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
    flex: .75,
    marginTop: 25,
    paddingTop: 20,
    marginBottom: 15,
  },
  segmentedContainer: {
    margin: 10,
    padding: 10,
  },
  inputContainer: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderBottomColor: '#CCC',
    borderColor: 'transparent',
  },
  inputFormat: {
    top: 5,
    left: 35,
    right: 0,
    height: 25,
  },
  inputStyle: {
    fontSize: 16,
    color: '#F5F5F6',
  },
  submitButton: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#34778A',
  },
  empty: {
    flex: .15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#F5F5F6',
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Light',
  },
  inputs: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: '#F5F5F6',
  },
  hidden: {
    opacity: 0,
  },
  segmented: {
    height: 40,
    borderWidth: 2,
    borderColor: '#CCC',
  },
  segmentedSpacing: {
    height: 20,
  }
});

export default CreateEvent;
