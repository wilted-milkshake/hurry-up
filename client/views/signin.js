
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
} from 'react-native';

import {createUser, login} from '../helpers/request-helpers';

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
      handleClick: props.handlePress
    };
  }

  onLogin() {
    if (this.state.username && this.state.password) {
      var user = {
        username: this.state.username,
        password: this.state.password,
      };
      var that = this;
      login(user, that);//createUser(newUser, that);
    } else {
      alert( 'You must fill out each field!' );
    }
  }

  onSignup() {
    console.log('Signup workds!!!!!!!!!!!')
    if (this.state.username && this.state.password && this.state.phoneNumber) {
      var newUser = {
        username: this.state.username,
        password: this.state.password,
        phoneNumber: this.state.phoneNumber,
      };
      var that = this;
      createUser(newUser, that);
    } else {
      alert( 'You must fill out each field!' );
    }
  }

  goToSignup() {
    this.setState({signup: true});
    this.render();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.mark}
            source={{uri: 'http://i.imgur.com/da4G0Io.png'}}/>
        </View>
        {this.state.signup
          ? (<View style={styles.inputs}>
              <View style={styles.inputContainer}>
                <Image
                  style={styles.inputUsername}
                  source={{uri: 'http://i.imgur.com/iVVVMRX.png'}}/>
                <TextInput
                  placeholder="Username"
                  value={this.state.username}
                  placeholderTextColor="#FFF"
                  style={[styles.input, styles.whiteFont]}
                  onChangeText={(username) => this.setState({username})}/>
              </View>
              <View style={styles.inputContainer}>
                <Image
                  style={styles.inputPassword}
                  source={{uri: 'http://i.imgur.com/ON58SIG.png'}}/>
                <TextInput
                  password={true}
                  placeholder="Password"
                  value={this.state.password}
                  placeholderTextColor="#FFF"
                  style={[styles.input, styles.whiteFont]}
                  onChangeText={(password) => this.setState({password})}/>
              </View>
              <View style={styles.inputContainer}>
                <Image
                  style={styles.inputPassword}
                  source={{uri: 'http://i.imgur.com/ON58SIG.png'}}/>
                <TextInput
                  style={[styles.input, styles.whiteFont]}
                  placeholder="Phone Number"
                  placeholderTextColor="#FFF"
                  value={this.state.phoneNumber}
                  onChangeText={(phoneNumber) => this.setState({phoneNumber})}/>
              </View>
              <TouchableHighlight
                style={styles.signup}
                onPress={this.onSignup.bind(this)}>
                  <Text style={styles.whiteFont}>
                    Sign Up
                  </Text>
              </TouchableHighlight>
            </View>)
          :(<View style={styles.inputs}>
            <View style={styles.inputContainer}>
              <Image
                style={styles.inputUsername}
                source={{uri: 'http://i.imgur.com/iVVVMRX.png'}}/>
              <TextInput
                placeholder="Username"
                value={this.state.username}
                placeholderTextColor="#FFF"
                style={[styles.input, styles.whiteFont]}
                onChangeText={(username) => this.setState({username})}/>
            </View>
            <View style={styles.inputContainer}>
              <Image
                style={styles.inputPassword}
                source={{uri: 'http://i.imgur.com/ON58SIG.png'}}/>
              <TextInput
                password={true}
                placeholder="Password"
                value={this.state.password}
                placeholderTextColor="#FFF"
                style={[styles.input, styles.whiteFont]}
                onChangeText={(password) => this.setState({password})}/>
            </View>
            <TouchableHighlight
              style={styles.signin}
              onPress={this.onLogin.bind(this)}>
                  <Text style={styles.whiteFont}>
                    Sign In
                  </Text>
            </TouchableHighlight>
          </View>)
        }

        {this.state.signup
          ? null
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
    backgroundColor: 'transparent'
  },
  bg: {
      top: 0,
      left: 0,
      position: 'absolute',
      width: windowSize.width,
      height: windowSize.height,
  },
  header: {
      flex: .4,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent'
  },
  mark: {
      width: 150,
      height: 150
  },
  signin: {
      padding: 20,
      marginTop: 30,
      alignItems: 'center',
      backgroundColor: '#34778A',
  },
  signup: {
      flex: 1,
      padding: 20,
      marginTop: 30,
      marginBottom: 30,
      alignItems: 'center',
      backgroundColor: '#34778A',
  },
  signupButton: {
    flex: .15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30
  },
  inputs: {
      flex: .38,
      marginTop: 10,
      marginBottom: 10,
  },
  inputPassword: {
      width: 20,
      height: 21,
      marginLeft: 15,
  },
  inputUsername: {
    width: 20,
    height: 20,
    marginLeft: 15,
  },
  inputContainer: {
      margin: 10,
      padding: 10,
      borderWidth: 1,
      borderBottomColor: '#CCC',
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
    color: '#D8D8D8'
  },
  whiteFont: {
    fontSize: 16,
    color: '#FFF',
  }
});

export default Login;
