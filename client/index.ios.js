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
  TouchableHighlight,
  Image,
  Dimensions
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import CreateEvent from './views/create-event';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class hurryup extends Component {
  render() {
    return (
      <View style={styles.parent}>
        <Image style={styles.bg} source={require('./background.png')} />
        <Text style={styles.welcome}>
          hurryup
        </Text>
        <ScrollableTabView style={{marginTop: 0, top: 0}} tabBarBackgroundColor="transparent" tabBarUnderlineColor="#F5F5F6" tabBarActiveTextColor="#F5F5F6" tabBarInactiveTextColor="#ACB2BE" tabBarTextStyle={{fontFamily: 'HelveticaNeue-Light', fontSize: 15}}>
          <CreateEvent tabLabel='Create Event' />
          <View tabLabel='My Events' style={styles.container}>
            <Text style={styles.welcome}>AWESOME</Text>
          </View>
        </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent'
  },
  bg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: deviceWidth,
    height: deviceHeight
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  welcome: {
    color: '#F5F5F6',
    fontSize: 25,
    fontFamily: 'HelveticaNeue',
    textAlign: 'center',
    marginTop: 20,
  },
});

AppRegistry.registerComponent('hurryup', () => hurryup);
