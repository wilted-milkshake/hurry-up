import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Image,
  Dimensions,
  ScrollView
} from 'react-native';

import Form from 'react-native-form';
import {getAllEvents} from '../helpers/request-helpers';

const deviceWidth       = Dimensions.get('window').width;
const deviceHeight      = Dimensions.get('window').height;
const distanceToRefresh = 0.004;

class AllEvents extends Component {

  constructor(props) {
    super(props);

  this.state = {
    events: []
    };
  }

  componentDidMount() {
    var that = this;
    getAllEvents(that);
  }

  buttonClicked() {
    var that = this;
    getAllEvents(that);
    this.render();
  }

  render() {
    var _scrollView: ScrollView;
    return (
          <ScrollView ref={(scrollView) => { _scrollView = scrollView; }}>
            <TouchableHighlight
              style={styles.button}
              onPress={this.buttonClicked.bind(this)}>
              <View>
                <Text style={styles.buttonText}>Refresh!</Text>
              </View>
            </TouchableHighlight>

              {this.state.events.map((event, index) =>
              <Text style={styles.welcome} key={index}> {event.eventName}</Text>
              )}

            <Text style={styles.welcome}>Can Scroll Down</Text>
            <Text style={styles.welcome}>Try it Out!</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
            <Text style={styles.welcome}>AWESOME POSSUM</Text>
          </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  eventName: {
    backgroundColor: 'transparent',
    color: '#F5F5F6',
    left: 40,
    fontSize: 14,
    height: 25,
    width: deviceWidth - 40
  },
  button: {
    backgroundColor: '#34778A',
    marginTop: 30,
    padding: 15,
    alignItems: 'center',
    width: deviceWidth
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
  welcome: {
    color: '#F5F5F6',
    fontSize: 25,
    fontFamily: 'HelveticaNeue',
    textAlign: 'center',
    marginTop: 20,
  },
});


export default AllEvents;
