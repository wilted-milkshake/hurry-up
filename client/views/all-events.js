import React, {
  Text,
  View,
  Component,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

import {getAllEvents, deleteEvent} from '../helpers/request-helpers';

const deviceWidth = Dimensions.get('window').width;

class AllEvents extends Component {

  constructor(props) {
    super(props);

    this.state = {
      events: [],
      userId: props.userId,
      eventClicked: false,
      archivedClicked: false,
      eventIndexClicked: null,
      archivedIndexClicked: null,
      clicked: false,
      indexClicked: null
    };
  }

  componentDidMount() {
    var that = this;
    getAllEvents(that);
  }

  buttonClicked() {
    //look into using websockets instead of refresh button / or state control
    var that = this;
    getAllEvents(that);
    this.render();
  }

  eventClicked(index) {
    this.setState({eventClicked: !this.state.eventClicked, eventIndexClicked: index});
    this.render();
  }

  archivedEventClicked(index) {
    this.setState({archivedClicked: !this.state.archivedClicked, archivedIndexClicked: index});
    this.render();
  }

  onDelete(event) {
    deleteEvent(event);
    this.setState({eventClicked: false});
    this.buttonClicked();
    this.render();
  }

  displayTime(time) {
    var dateTime = time.toString();
    var hours = dateTime.substring(16,18);
    var postfix;
    if (Number(hours) > 12) {
      postfix = 'PM';
      hours = hours - 12;
    } else {
      postfix = 'AM';
    }
    var minutes = dateTime.substring(19,21);
    return hours + ':' + minutes + ' ' + postfix;
  }

  displayDuration(duration) {
    var minutes = Math.ceil(duration / 60);

    if (minutes < 60) {
      minutes = minutes.toString();
      return minutes + 'm';
    }

    if (minutes > 60) {
      var hours = Math.floor(minutes / 60);
      minutes = Math.ceil(minutes - hours * 60);
      minutes = minutes.toString();
      hours = hours.toString();
      return hours + 'h ' + minutes + 'm';
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          {this.state.events.filter(event => event.hasOccured === 'false').map((event, index) =>
            <View key={index}>
              <TouchableHighlight onPress={this.eventClicked.bind(this, index)}>
                <View style={styles.EventContainer}>
                  <View style={styles.EventRow}>
                    <Text style={styles.EventTitle}>Event:</Text>
                    <View style={styles.EventInput}>
                      <Text style={styles.EventText}>{event.eventName} @ {this.displayTime(event.eventTime)} on {event.eventTime.substring(0,10)}</Text>
                    </View>
                  </View>
                  <View style={styles.EventRow}>
                    <Text style={styles.EventTitle}>Where: </Text>
                    <View style={styles.EventInput}>
                      <Text style={styles.EventText}>{event.address} {event.city} {event.state}</Text>
                    </View>
                  </View>

                  <View style={styles.EventRow}>
                    <Text style={styles.EventTitle}>Estimated Travel Time: </Text>
                    <View style={styles.EventInput}>
                      <Text style={styles.EventText}>{this.displayDuration(event.duration)}</Text>
                    </View>
                  </View>

                  <View style={styles.EventRow}>
                    <Text style={styles.EventTitle}>Getting there by: </Text>
                    <View style={styles.EventInput}>
                      <Text style={styles.EventText}>{event.mode}</Text>
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
              {(this.state.eventClicked && index === this.state.eventIndexClicked)
                ? (<TouchableHighlight
                  style={styles.deleteButton}
                  onPress={this.onDelete.bind(this, event)}>
                  <View>
                    <Text style={styles.buttonText}>Delete</Text>
                  </View>
                </TouchableHighlight>)
                : (<View></View>)
              }
              </View>
            )}

            <Text style={styles.welcome}>Archived Events</Text>

            {this.state.events.filter(event => event.hasOccured === 'true').map((event, index) =>
              <View key={'main' + index}>
              <TouchableHighlight onPress={this.archivedEventClicked.bind(this, index)}>
                <View style={styles.ArchiveContainer}>
                  <View style={styles.EventRow}>
                    <Text style={styles.EventTitle}>Event:</Text>
                    <View style={styles.EventInput}>
                      <Text style={styles.ArchivedText}>{event.eventName}</Text>
                    </View>
                  </View>
                  <View style={styles.EventRow}>
                    <Text style={styles.EventTitle}>Where: </Text>
                    <View style={styles.EventInput}>
                      <Text style={styles.ArchivedText}>{event.address} {event.city} {event.state}</Text>
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
              {(this.state.archivedClicked && index === this.state.archivedIndexClicked)
                ? (<TouchableHighlight
                  style={styles.deleteButton}
                  onPress={this.onDelete.bind(this, event)}>
                  <View>
                    <Text style={styles.buttonText}>Delete</Text>
                  </View>
                </TouchableHighlight>)
                : (<View></View>)
              }
            </View>
          )}

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
    padding: 15,
    height: 150,
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: '#274A57',
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
  ArchiveContainer: {
    flex: 1,
    padding: 15,
    height: 90,
    borderWidth: 1,
    borderColor: 'transparent',
    // borderBottomColor: '#284D59',
    // backgroundColor: '#1B3138',
    borderBottomColor: '#353B3D',
    backgroundColor: '#2F3336',
  },
  ArchivedText: {
    flex: 1,
    margin: 5,
    fontSize: 16,
    color: '#A5A5A5',
  },
  welcome: {
    padding: 20,
    fontSize: 18,
    color: '#ACB2BE',
    textAlign: 'center',
    fontFamily: 'HelveticaNeue',
    // backgroundColor: '#15272E',
    backgroundColor: '#242829',
  },
  button: {
    padding: 20,
    width: deviceWidth,
    alignItems: 'center',
    backgroundColor: '#34778A',
  },
  deleteButton: {
    padding: 20,
    width: deviceWidth,
    alignItems: 'center',
    backgroundColor: '#A10000',
  },
  buttonText: {
    fontSize: 16,
    color: '#F5F5F6',
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Light',
  },
});

export default AllEvents;
