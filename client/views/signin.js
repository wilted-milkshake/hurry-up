import React, {
  Text,
  View,
  Image,
  TextInput,
  Component,
  Dimensions,
  StyleSheet,
  AppRegistry,
  TouchableHighlight,
  Animated,
} from 'react-native';

import {createUser, login} from '../helpers/request-helpers';
import Video from 'react-native-video';

const windowSize = Dimensions.get('window');

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      phoneNumber: '',
      signup: false,
      loggedIn: props.loggedIn,
      handleClick: props.handlePress,
      fadeAnim: new Animated.Value(0)
    };
  }

  onLogin() {
    if (this.state.username && this.state.password) {
      var user = {
        username: this.state.username,
        password: this.state.password,
      };
      var that = this;
      login(user, that); //createUser(newUser, that);
    } else {
      alert( 'You must fill out each field!' );
    }
  }

  onSignup() {
    if (this.state.username && this.state.password && this.state.phoneNumber) {
      var newUser = {
        username: this.state.username,
        password: this.state.password,
        phoneNumber: this.state.phoneNumber,
      };
      var that = this;
      createUser(newUser, that);
    } else {
      alert('You must fill out each field!');
    }
  }

  goToSignup() {
    this.setState({signup: true});
    this.render();
  }

  goToLogin() {
    this.setState({signup: false});
    this.render();
  }

  componentDidMount() {
    Animated.timing(this.state.fadeAnim, {toValue: 1, duration: 2000}).start();
  }

  render() {
    return (
      <View style={styles.container}>
        <Video source={{uri:"NYC-Traffic"}}
            style={styles.backgroundVideo}
            paused={false}
            rate={1} volume={1} muted={true}
            resizeMode="cover" repeat={true}
          />
          <Animated.View style={{opacity: this.state.fadeAnim}}>
            <Text style={styles.title}>Hurry Up</Text>
          </Animated.View>
        {this.state.signup
        ? (<View style={styles.inputs}>
            <View style={styles.inputContainer}>
              <Image
                style={styles.inputUsername}
                source={require('../user.png')}/>
              <TextInput
                placeholder="Username"
                value={this.state.username}
                placeholderTextColor="#2C3539"
                autoCapitalize="none"
                autoCorrect={false}
                style={[styles.input, styles.greyFont]}
                onChangeText={(username) => this.setState({username})}/>
            </View>
            <View style={styles.inputContainer}>
              <Image
                style={styles.inputPassword}
                source={require('../unlock.png')}/>
              <TextInput
                password={true}
                placeholder="Password"
                value={this.state.password}
                placeholderTextColor="#2C3539"
                style={[styles.input, styles.greyFont]}
                onChangeText={(password) => this.setState({password})}/>
            </View>
            <View style={styles.inputContainer}>
              <Image
                style={styles.inputUsername}
                source={require('../telephone.png')}/>
              <TextInput
                style={[styles.input, styles.greyFont]}
                placeholder="Phone Number"
                placeholderTextColor="#2C3539"
                keyboardType="phone-pad"
                value={this.state.phoneNumber}
                onChangeText={(phoneNumber) => this.setState({phoneNumber})}/>
            </View>
            <View style={styles.border}>
              <TouchableHighlight
                style={styles.signin}
                onPress={this.onSignup.bind(this)}>
              <Text style={styles.greyFont}>
                  Sign Up
              </Text>
            </TouchableHighlight>
          </View>
        </View>)
        : (<View style={styles.inputs}>
            <View style={styles.inputContainer}>
              <Animated.View style={{opacity: this.state.fadeAnim}}>
                <Image
                  style={styles.inputUsername}
                  source={require('../user.png')}/>
                <TextInput
                  placeholder="Username"
                  value={this.state.username}
                  placeholderTextColor="#2C3539"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.input, styles.greyFont]}
                  onChangeText={(username) => this.setState({username})}/>
              </Animated.View>
            </View>
            <View style={styles.inputContainer}>
              <Animated.View style={{opacity: this.state.fadeAnim}}>
                <Image
                  style={styles.inputPassword}
                  source={require('../unlock.png')}/>
                <TextInput
                  password={true}
                  placeholder="Password"
                  value={this.state.password}
                  placeholderTextColor="#2C3539"
                  style={[styles.input, styles.greyFont]}
                  onChangeText={(password) => this.setState({password})} />
              </Animated.View>
            </View>
            <View style={styles.siginBtn}>
              <Animated.View style={{opacity: this.state.fadeAnim}}>
                <TouchableHighlight
                  style={styles.signin}
                  onPress={this.onLogin.bind(this)}>
                  <Text style={styles.greyFont}>
                    Sign In
                  </Text>
                </TouchableHighlight>
              </Animated.View>
            </View>
          </View>)
      }
      {this.state.signup
        ? (<View style={styles.signupButton}>
            <Text style={styles.greyFont}>Already have an account?</Text>
            <TouchableHighlight onPress={this.goToLogin.bind(this)}>
              <Text style={styles.whiteFont}>Login</Text>
            </TouchableHighlight>
          </View>)
          : (<View style={styles.signupButton}>
              <Text style={styles.greyFont}>Don't have an account?</Text>
              <TouchableHighlight onPress={this.goToSignup.bind(this)}>
                <Text style={styles.whiteFont}>Sign Up</Text>
              </TouchableHighlight>
            </View>)
          }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  backgroundVideo: {
    position: 'absolute',
    opacity: 0.6,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  bg: {
    top: 0,
    left: 0,
    position: 'absolute',
    width: windowSize.width,
    height: windowSize.height,
  },
  title: {
    fontSize: 40,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    top: 150,
    fontFamily: 'HelveticaNeue',
  },
  header: {
    flex: .4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  mark: {
    width: 150,
    height: 200,
  },
  signin: {
    flex: 1,
    padding: 10,
    margin: 30,
    alignItems: 'center',
    backgroundColor: '#EEE',
  },
  signupButton: {
    flex: .15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputs: {
    flex: .38,
    top: 225,
  },
  inputPassword: {
    width: 15,
    height: 21,
    marginLeft: 15,
  },
  inputUsername: {
    width: 22,
    height: 22,
    marginLeft: 15,
  },
  inputContainer: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderBottomColor: '#2C3539',
    borderColor: 'transparent',
  },
  input: {
    top: 12,
    right: 0,
    left: 61,
    height: 20,
    position: 'absolute',
  },
  greyFont: {
    color: 'black'
  },
  whiteFont: {
    fontSize: 16,
    color: '#FFF',
  }
});

export default Login;
