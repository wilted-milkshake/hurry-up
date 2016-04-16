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

const PickerItemIOS     = PickerIOS.Item;
const deviceWidth       = Dimensions.get('window').width;
const deviceHeight      = Dimensions.get('window').height;
const earlyArrivalTimes = [{time: '5 minutes', value: '300'},{time: '10 minutes', value: '600'},{time: '15 minutes', value: '900'}, {time: '20 minutes', value: '1200'}, {time: '30 minutes', value: '1800'}, {time: '45 minutes', value: '2700'}, {time: '1 hour', value: '3600'}];

class Picker extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Animated.timing(this.props.offSet, {
       duration: 300,
       toValue: 50
     }).start();
  }

  closeModal() {
    Animated.timing(this.props.offSet, {
       duration: 300,
       toValue: deviceHeight
    }).start(this.props.closeModal);
  }

  render() {
    return (
      <Animated.View style={[{ transform: [{translateY: this.props.offSet}] }, styles.pickerPosition]}>
          <View style={styles.closeButtonContainer}>
            <TouchableHighlight onPress={this.closeModal.bind(this)} underlayColor="transparent" style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Choose</Text>
            </TouchableHighlight>
          </View>
          <PickerIOS
          selectedValue={this.props.earlyArrivalIndex}
          onValueChange={(index) => this.props.changeEarlyArrival(index)}>
          {Object.keys(earlyArrivalTimes).map((time) => (
            <PickerItemIOS
              key={time}
              value={time}
              label={earlyArrivalTimes[time].time}
            />
          ))}
        </PickerIOS>
      </Animated.View>
    );
  }
};

const styles = StyleSheet.create({
  pickerPosition: {
    backgroundColor: '#D8D8D8',
    position: 'absolute',
    width: deviceWidth,
    height: deviceHeight*.5,
    top: deviceHeight*.1,
    left: -(deviceWidth*.025),
  },
  closeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopColor: '#e2e2e2',
    borderTopWidth: 1,
    borderBottomColor: '#e2e2e2',
    borderBottomWidth:1
  },
  closeButton: {
   paddingRight:10,
    paddingTop:10,
    paddingBottom:10
  },
  closeButtonText: {
   color: '#027afe'
  },
});

export default Picker;
