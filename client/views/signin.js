
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

const windowSize = Dimensions.get('window');

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      phoneNumber: '',
      loggedIn: props.loggedIn,
      handleClick: props.handlePress
    };
  }

  onClick() {
    this.state.handleClick();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.mark}
            source={{uri: 'http://i.imgur.com/da4G0Io.png'}}/>
        </View>
        {this.state.loggedIn
          ? null
          :(<View style={styles.inputs}>
            <View style={styles.inputContainer}>
              <Image
                style={styles.inputUsername}
                source={{uri: 'http://i.imgur.com/iVVVMRX.png'}}/>
              <TextInput
                placeholder="Username"
                value={this.state.username}
                placeholderTextColor="#FFF"
                style={[styles.input, styles.whiteFont]}/>
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
                style={[styles.input, styles.whiteFont]}/>
            </View>
            <View style={styles.inputContainer}>
              <Image
                style={styles.inputPassword}
                source={{uri: 'http://i.imgur.com/ON58SIG.png'}}/>
              <TextInput
                style={[styles.input, styles.whiteFont]}
                placeholder="Phone Number"
                placeholderTextColor="#FFF"
                value={this.state.phoneNumber}/>
            </View>
          </View>)
        }
        <TouchableHighlight
          style={styles.signin}
          onPress={this.onClick.bind(this)}>
            {this.state.loggedIn
              ?(<Text style={styles.whiteFont}>
                  Sign Out
                </Text>)
              : (<Text style={styles.whiteFont}>
                  Sign In
                </Text>)
            }
        </TouchableHighlight>

        {this.state.loggedIn
          ? (<View style={styles.signup}></View>)
          : (<View style={styles.signup}>
              <Text style={styles.greyFont}>Don't have an account?</Text>
              <Text style={styles.whiteFont}>Sign Up</Text>
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
      alignItems: 'center',
      backgroundColor: '#34778A',
  },
  signup: {
    flex: .15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputs: {
      flex: .28,
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
