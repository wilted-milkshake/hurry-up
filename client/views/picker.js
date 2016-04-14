import {Component} from 'react-native';

export default class Picker extends Component {

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
      <Animated.View style={{ transform: [{translateY: this.props.offSet}], backgroundColor: '#D8D8D8', position: 'absolute', width: 410, height: 290, top: 20, left: -10}}>
          <View style={styles.closeButtonContainer}>
            <TouchableHighlight onPress={this.closeModal.bind(this)} underlayColor="transparent" style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Choose</Text>
            </TouchableHighlight>
          </View>
          <PickerIOS
          selectedValue={this.props.showtime}
          onValueChange={(index) => this.props.changeTime(index)}>
          {Object.keys(showtimes).map((time) => (
            <PickerItemIOS
              key={time}
              value={time}
              label={showtimes[time].time}
            />
          ))}
        </PickerIOS>
      </Animated.View>   
    );
  }
};
