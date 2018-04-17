/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  NativeModules,
  Button
} from 'react-native';

export default class App extends Component<{}> {
  constructor(props) {
    super(props)
    this.state = {
      title: "Welcome to Onfido SDK's!",
      subtitle: "To get started, press \"Launch\""
    }
  }

  setTextContent(titleContent, subtitleContent) {
    this.setState({
      title: titleContent,
      subtitle: subtitleContent
    })
  }

  launchSDK() {
    NativeModules.OnfidoSDK.startSDK();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {this.state.title}
        </Text>
        <Text style={styles.instructions}>
          {this.state.subtitle}
        </Text>
        <Button onPress={() => this.launchSDK()}
                title="Launch"
                color="#159375"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 10,
  },
});
