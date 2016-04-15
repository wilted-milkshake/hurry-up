import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
  ScrollView
} from 'react-native';

import {getAllEvents} from '../helpers/request-helpers';

const deviceWidth = Dimensions.get('window').width;

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
      <View style={{flex: 1}}>
      <ScrollView ref={(scrollView) => { _scrollView = scrollView; }}>
          {this.state.events.map((event, index) =>
            <View style={styles.EventContainer} key={index}>
              <View style={styles.EventRow}>
                <Text style={styles.EventTitle}>Event:</Text>
                <View style={styles.EventInput}>
                  <Text style={styles.EventText}>{event.eventName} @ {event.eventTime}</Text>
                </View>
              </View>
              <View style={styles.EventRow}>
                <Text style={styles.EventTitle}>Where: </Text>
                <View style={styles.EventInput}>
                  <Text style={styles.EventText}>{event.destination}</Text>
                </View>
              </View>
              <View style={styles.EventRow}>
                <Text style={styles.EventTitle}>Getting there by: </Text>
                <View style={styles.EventInput}>
                  <Text style={styles.EventText}>{event.mode}</Text>
                </View>
              </View>
            </View>
          )}
          <Text style={styles.welcome}>no more events</Text>
      </ScrollView>
      <TouchableHighlight
        style={styles.button}
        onPress={this.buttonClicked.bind(this)}>
        <View>
          <Text style={styles.buttonText}>Refresh!</Text>
        </View>
      </TouchableHighlight>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  EventContainer: {
    flex: 1,
    margin: 7,
    padding: 15,
    height: 150,
    borderWidth: 1,
    borderBottomColor: '#F5F5F6',
    borderColor: 'transparent'
  },
  EventRow: {
    flex: 1,
    flexDirection:'row',
  },
  EventTitle: {
    margin: 5,
    fontSize: 14,
    color: '#ACB2BE',
    textDecorationLine: 'underline'
  },
  EventInput: {
    flex: 1,
    alignItems: 'flex-end',
  },
  EventText: {
    flex: 1,
    margin: 5,
    fontSize: 16,
    color: '#F5F5F6',
  },
  welcome: {
    color: '#ACB2BE',
    fontSize: 20,
    fontFamily: 'HelveticaNeue',
    textAlign: 'center',
    margin: 20,
  },
  button: {
    backgroundColor: '#34778A',
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
});


export default AllEvents;
