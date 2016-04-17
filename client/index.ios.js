
import React, {
  Text,
  View,
  Image,
  Component,
  Dimensions,
  StyleSheet,
  AppRegistry,
  TouchableHighlight,
} from 'react-native';

import Login from './views/signin';
import AllEvents from './views/all-events';
import CreateEvent from './views/create-event';
import ScrollableTabView from 'react-native-scrollable-tab-view';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class hurryup extends Component {

  render() {
    return (
      <View style={styles.parent}>
        <Image
          style={styles.bg}
          source={require('./background.png')}/>
        <Text style={styles.welcome}>
          hurryup
        </Text>
        <ScrollableTabView
          style={{marginTop: 0, top: 0}}
          tabBarUnderlineColor="#F5F5F6"
          tabBarActiveTextColor="#F5F5F6"
          tabBarInactiveTextColor="#ACB2BE"
          tabBarBackgroundColor="transparent"
          tabBarTextStyle={{fontFamily: 'HelveticaNeue-Light', fontSize: 15}}>
          <Login tabLabel='Log In/Out'/>
          <CreateEvent tabLabel='Create Event' />
          <AllEvents tabLabel='My Events' />
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
    top: 0,
    left: 0,
    width: deviceWidth,
    position: 'absolute',
    height: deviceHeight,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  welcome: {
    fontSize: 25,
    marginTop: 20,
    color: '#F5F5F6',
    textAlign: 'center',
    fontFamily: 'HelveticaNeue',
  },
});

AppRegistry.registerComponent('hurryup', () => hurryup);
