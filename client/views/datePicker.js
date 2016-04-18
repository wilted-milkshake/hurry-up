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
  DatePickerIOS
} from 'react-native';

const deviceWidth  = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class DatePicker extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Animated.timing(this.props.dateOffset, {
       duration: 300,
       toValue: 50
     }).start();
  }

  closeModal() {
    Animated.timing(this.props.dateOffset, {
       duration: 300,
       toValue: deviceHeight
    }).start(this.props.closeModal);
  }

  /* REMOVED 'choose' TOUCHABLE HIGHLIGHT
    <View style={styles.closeButtonContainer}>
      <TouchableHighlight
        onPress={this.closeModal.bind(this)}
        underlayColor="transparent"
        style={styles.closeButton}>
        <Text style={styles.closeButtonText}>
          Choose
        </Text>
      </TouchableHighlight>
    </View>
  */

  render() {
    return (
      <Animated.View style={[{ transform: [{translateY: this.props.dateOffset}] }, styles.pickerPosition]}>
        <DatePickerIOS
          date={this.props.date}
          mode={this.props.mode}
          minuteInterval={this.props.minuteInterval}
          timeZoneOffsetInMinutes={this.props.timeZoneOffsetInHours * 60}
          onDateChange={(date) => this.props.onDateChange(date)}
        />
      </Animated.View>
    );
  }
};

const styles = StyleSheet.create({
  pickerPosition: {
    width: deviceWidth,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    // top: deviceHeight*.1,
    height: deviceHeight*.5,
    left: -(deviceWidth*.025),
    backgroundColor: '#D8D8D8',
  },
  closeButtonContainer: {
    borderTopWidth: 1,
    borderBottomWidth:1,
    flexDirection: 'row',
    borderTopColor: '#e2e2e2',
    justifyContent: 'flex-end',
    borderBottomColor: '#e2e2e2',
  },
  closeButton: {
    paddingTop:10,
    paddingRight:10,
    paddingBottom:10
  },
  closeButtonText: {
   color: '#027afe'
  },
});

export default DatePicker;
