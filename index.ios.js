
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

import Login from './client/views/signin';
import AllEvents from './client/views/all-events';
import CreateEvent from './client/views/create-event';
import ScrollableTabView from 'react-native-scrollable-tab-view';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

class hurryup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      userId: null
    };
  }

  handleSignIn(userId) {
    this.setState({
      loggedIn: true,
      userId: userId
    });
    this.render();
  }

  render() {
    return (
      <View style={styles.parent}>
        {this.state.loggedIn
          ? (
            <View>
              <Image
                style={styles.bg}
                source={require('./client/background.png')}/>
              <ScrollableTabView
                page={0}
                style={{marginTop: 20, top: 20}}
                tabBarUnderlineColor="#F5F5F6"
                tabBarActiveTextColor="#F5F5F6"
                tabBarInactiveTextColor="#ACB2BE"
                tabBarBackgroundColor="transparent"
                tabBarTextStyle={{fontFamily: 'HelveticaNeue-Light', fontSize: 15}}>
                <CreateEvent userId = {this.state.userId} tabLabel='Create Event' />
                <AllEvents userId = {this.state.userId} tabLabel='My Events' />
              </ScrollableTabView>
            </View>)
          : (<Login loggedIn = {this.state.loggedIn} handlePress = {this.handleSignIn.bind(this)} tabLabel=''/>)
        }
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
 });

AppRegistry.registerComponent('hurryup', () => hurryup);
