/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  TextInput,
  PickerIOS
} from 'react-native';

import Form from 'react-native-form';


class hurryup extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Hurry Up!
        </Text>

        <Text style={styles.instructions}>
          Your Event:
        </Text>
        <View>
          <TextInput
            style={styles.eventName}
            type='TextInput'
            name="eventName"/>
        </View>

        <Text style={styles.instructions}>
          Event Location:
        </Text>
        <View>
          <TextInput
            style={styles.eventName}
            type='TextInput'
            name="eventLocation"/>
        </View>

        <Text style={styles.instructions}>
          Event Time:
        </Text>
        <View>
          <TextInput
            style={styles.eventName}
            type='TextInput'
            name="eventTime"/>
        </View>

        <Text style={styles.instructions}>
          am/pm:
        </Text>
        <View>
          <TextInput
            style={styles.eventName}
            type='TextInput'
            name="eventTime"/>
        </View>

        <Text style={styles.instructions}>
          How Early Do You Want To Get There:
        </Text>
        <View>
          <TextInput
            style={styles.eventName}
            type='TextInput'
            name="eventTime"/>
        </View>

        <Text style={styles.instructions}>
          How Are You Getting There:
        </Text>
        <View>
          <TextInput
            style={styles.eventName}
            type='TextInput'
            name="eventTime"/>
        </View>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00b37a',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
    eventName: {
      backgroundColor: 'white',
      color: 'black',
      height: 40,
      borderColor: 'black',
      borderWidth: 1,
      width: 200
  },
});

AppRegistry.registerComponent('hurryup', () => hurryup);
