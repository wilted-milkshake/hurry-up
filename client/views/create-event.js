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

/* Temporary fix for DatePicker type warnings.
 * Refer to: https://github.com/facebook/react-native/issues/4547 */
console.ignoredYellowBox = [
  'Warning: Failed propType',
];

import Picker from './picker';
import DatePicker from './datePicker';
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
      userId: props.userId,
      eventName: '',
      eventTime: '',
      address: '',
      mode: 'Driving',
      earlyArrivalIndex: 0,
      lastPosition: 'unknown',
      initialPosition: 'unknown',
      state:'',
      city:'',
      modal: false,
      offSet: new Animated.Value(deviceHeight),
      values: ['Driving', 'Walking' , 'Bicycling', 'Transit'],
      date: new Date(),
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
      dateModal: false,
      dateOffset: new Animated.Value(deviceHeight)
    };
  }
  //TODO: Must move all timer/ location events to main app view otherwise on signout
  // this gets unmounted and cannot update state
  //(for location so last posiion/Initial position)
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
      address: '',
      state:'',
      city:'',
      earlyArrivalIndex: 0,
    //mode: 'Driving',        //Commented out until refresh unhighlights previous selected segment
    });
  }

  buttonClicked() {
    if (this.state.eventName && this.state.date && this.state.address && this.state.city && this.state.state && this.state.mode) {
      var newEvent  = {
        mode: this.state.mode,
        eventName: this.state.eventName,
        eventTime: this.state.date.toString(),
        address: this.state.address + ',' ,
        city: this.state.city + ',' ,
        state: this.state.state ,
        earlyArrival: earlyArrivalTimes[this.state.earlyArrivalIndex].value,
        userId: this.state.userId,
      };
      sendEvent(newEvent);
      this.clearForm();

      var origin   = this.state.initialPosition.coords;
      var that = this;
      updateLocation(origin, that);

      this.watchID = navigator.geolocation.watchPosition((position) => {
        var lastPosition = position;
        this.setState({ lastPosition });
        var initialPosition   = this.state.initialPosition;
        var lastLatitude      = lastPosition.coords.latitude;
        var lastLongitude     = lastPosition.coords.longitude;
        var initialLatitude   = initialPosition.coords.latitude;
        var initialLongitude  = initialPosition.coords.longitude;

        var distanceTraveled  = Math.sqrt(Math.pow((initialLatitude - lastLatitude), 2) + Math.pow((initialLongitude - lastLongitude), 2));

        if (distanceTraveled >= DISTANCE_TO_REFRESH) {
          updateLocation(this.state.lastPosition.coords, that);
          this.setState({ initialPosition: lastPosition });
        }
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 60000});
    } else {
      alert( 'You must fill out each field!' );
    }
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

  displayTime() {
    var dateString = this.state.date.toString();
    var date = dateString.substring(0,10);
    var hours = dateString.substring(16,18);
    var postfix;
    if (Number(hours) > 12) {
      postfix = 'PM';
      hours = hours - 12;
    } else {
      postfix = 'AM';
    }
    var minutes = dateString.substring(19,21);
    return date + ', ' + hours + ':' + minutes + ' ' + postfix;
  }

  onDateChange(date) {
    this.setState({date: date});
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

           <View style={styles.rowcontainer}>
             <View style={styles.rowaddressContainer}>
              <TextInput style={styles.textInput}
                placeholder=" Event Address"
                placeholderTextColor="#F5F5F6"
                value={this.state.address}
                style={[styles.inputFormat, styles.inputStyle]}
                onChangeText={(address) => this.setState({address})}/>
            </View>
             <View style={styles.rowcityContainer}>
              <TextInput style={styles.textInput}
                placeholder="City"
                placeholderTextColor="#F5F5F6"
                value={this.state.city}
                style={[styles.inputFormat, styles.inputStyle]}
                onChangeText={(city) => this.setState({city})}/>
            </View>
            <View style={styles.rowstateContainer}>
              <TextInput style={styles.textInput}
                placeholder="St"
                placeholderTextColor="#F5F5F6"
                value={this.state.state}
                style={[styles.inputFormat, styles.inputStyle]}
                onChangeText={(state) => this.setState({state})}/>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TouchableHighlight
              style={styles.inputFormat}
              underlayColor="transparent"
              onPress={() => { this.state.dateModal ? this.setState({ dateModal: false }) : this.setState({ dateModal: true })}}>
              <Text style={styles.inputStyle}>
                Event Time -- {this.displayTime()}
              </Text>
            </TouchableHighlight>
              { this.state.dateModal
                ? <DatePicker
                  dateOffset={this.state.dateOffset}
                  closeModal={console.log('ERR: closeModal not working')}
                  onDateChange={this.onDateChange.bind(this)}
                  date={this.state.date}
                  mode="datetime"
                  minuteInterval={null}
                  timeZoneOffsetInHours={this.state.timeZoneOffsetInHours}/>
                : null
              }
          </View>

          <View style={this.state.dateModal ? [{ transform: [{translateY: deviceHeight*.7}] }] : styles.inputContainer}>
            <TouchableHighlight
              style={styles.inputFormat}
              underlayColor="transparent"
              onPress={() => { this.state.modal ? this.setState({ modal: false }) : this.setState({ modal: true })}}>
              <Text style={styles.inputStyle}>
                Early Arrival -- {earlyArrivalTimes[this.state.earlyArrivalIndex].time}
              </Text>
            </TouchableHighlight>
              { this.state.modal
                ? <Picker
                  offSet={this.state.offSet}
                  earlyArrivalIndex={this.state.earlyArrivalIndex}
                  closeModal={console.log(':( consistent modal-ing')}
                  changeEarlyArrival={this.changeEarlyArrival.bind(this)}/>
                : null
              }
          </View>

          <View style={(this.state.modal || this.state.dateModal) ? styles.hidden : styles.segmentedContainer}>
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
          pointerEvents={(this.state.modal || this.state.dateModal) ? 'none' : 'auto'}
          style={(this.state.modal || this.state.dateModal) ? styles.hidden : styles.submitButton}>
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
    flex: 1,
    marginTop: 10,
    paddingTop: 20,
    marginBottom: 10,
  },
  segmentedContainer: {
    margin: 10,
    padding: 10,
  },
  inputContainer: {
    margin: 15,
    padding: 10,
    borderWidth: 1,
    borderBottomColor: '#CCC',
    borderColor: 'transparent',
  },
  inputFormat: {
    top: 5,
    left: 3,
    right: 0,
    height: 20,
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
    flex: .17,
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
  },
  rowcontainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
 },
 rowaddressContainer: {
    flex: .60,
    height: 40,
    width: 60,
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderBottomColor: '#CCC',
    borderColor: 'transparent',
 },
 rowcityContainer: {
    flex: .45,
    height: 40,
    width: 20,
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderBottomColor: '#CCC',
    borderColor: 'transparent',
 },
 rowstateContainer: {
    flex: .15,
    height: 40,
    width: 5,
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderBottomColor: '#CCC',
    borderColor: 'transparent',
 }

});

export default CreateEvent;
