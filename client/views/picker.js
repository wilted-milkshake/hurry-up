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
} from 'react-native';

const PickerItemIOS     = PickerIOS.Item;
const deviceWidth       = Dimensions.get('window').width;
const deviceHeight      = Dimensions.get('window').height;
const earlyArrivalTimes = [
  {time: '5 minutes', value: '300'},
  {time: '10 minutes', value: '600'},
  {time: '15 minutes', value: '900'},
  {time: '20 minutes', value: '1200'},
  {time: '30 minutes', value: '1800'},
  {time: '45 minutes', value: '2700'},
  {time: '1 hour', value: '3600'}
];

class Picker extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <PickerIOS
          style={styles.pickerPos}
          selectedValue={this.props.earlyArrivalIndex}
          onValueChange={(index) => this.props.changeEarlyArrival(index)}>
          {Object.keys(earlyArrivalTimes).map((time) => (
            <PickerItemIOS
              style={styles.pickerPos}
              key={time}
              value={time}
              label={earlyArrivalTimes[time].time}/>
          ))}
        </PickerIOS>
    );
  }
};

const styles = StyleSheet.create({
  greyFont: {
    color: 'black',
  },
  pickerPos: {
    marginTop: 30,    
    color: 'black',
    backgroundColor: 'white',
  },
});

export default Picker;
