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
  TouchableHighlight,
  Dimensions,
  Image
} from 'react-native';

import Form from 'react-native-form';
const windowSize = Dimensions.get('window');

//import Location from 'react-native-location';

class hurryup extends Component {

  constructor(props) {
    super(props);

  this.state = {
      username: '',
      password: '',
      phoneNumber: ''
    };
  }

  render() {
    return (
      <View style={styles.container}>
          <Image style={styles.bg} source={require('./fadeBackground.jpg')} />
          <View style={styles.header}>
              <Image style={styles.mark} source={{uri: 'http://i.imgur.com/da4G0Io.png'}} />
          </View>
          <View style={styles.inputs}>
              <View style={styles.inputContainer}>
                  <Image style={styles.inputUsername} source={{uri: 'http://i.imgur.com/iVVVMRX.png'}}/>
                  <TextInput 
                      style={[styles.input, styles.whiteFont]}
                      placeholder="Username"
                      placeholderTextColor="#FFF"
                      value={this.state.username}
                  />
              </View>
              <View style={styles.inputContainer}>
                  <Image style={styles.inputPassword} source={{uri: 'http://i.imgur.com/ON58SIG.png'}}/>
                  <TextInput
                      password={true}
                      style={[styles.input, styles.whiteFont]}
                      placeholder="Password"
                      placeholderTextColor="#FFF"
                      value={this.state.password}
                  />
              </View>
              <View style={styles.inputContainer}>
                  <Image style={styles.inputPassword} source={{uri: 'http://i.imgur.com/ON58SIG.png'}}/>
                  <TextInput
                      style={[styles.input, styles.whiteFont]}
                      placeholder="Phone Number"
                      placeholderTextColor="#FFF"
                      value={this.state.phoneNumber}
                  />
              </View>
          </View>
          <View style={styles.signin}>
              <Text style={styles.whiteFont}>Sign In</Text>
          </View>
          <View style={styles.signup}>
          </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'transparent'
  },
  bg: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: windowSize.width,
      height: windowSize.height
  },
  header: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: .4,
      backgroundColor: 'transparent'
  },
  mark: {
      width: 150,
      height: 150
  },
  signin: {
      backgroundColor: '#34778A',
      padding: 20,
      alignItems: 'center',
  },
  signup: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: .12
  },
  inputs: {
      marginTop: 10,
      marginBottom: 10,
      flex: .28
  },
  inputPassword: {
      marginLeft: 15,
      width: 20,
      height: 21
  },
  inputUsername: {
    marginLeft: 15,
    width: 20,
    height: 20
  },
  inputContainer: {
      padding: 10,
      margin: 10,
      borderWidth: 1,
      borderBottomColor: '#CCC',
      borderColor: 'transparent'
  },
  input: {
      position: 'absolute',
      left: 61,
      top: 12,
      right: 0,
      height: 20,
      
  },
  greyFont: {
    color: '#D8D8D8'
  },
  whiteFont: {
    color: '#FFF',
    fontSize: 16
  }
});

AppRegistry.registerComponent('hurryup', () => hurryup);
