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
      title: "Welcome to Onfido SDK!",
      subtitle: "To get started, press \"Launch\""
    }
    this.token = "YOUR_TOKEN"
  }

  setTextContent(titleContent, subtitleContent) {
    this.setState({
      title: titleContent,
      subtitle: subtitleContent
    })
  }

  launchSDK = () => {
    this.createApplicant((applicantId) => {
          NativeModules.OnfidoSDK.startSDK(
            this.token,
            applicantId,
            () => { this.setTextContent("Verification complete", "To perform another verification, press \"Launch\"") },
            (errorCause) => { this.setTextContent("Flow not finished", "To try again, press \"Launch\"") }
          );
      })
  }

  // we recommend to create applicant in your backend server. The code below is demo a working integration of the Onfido Mobile SDK's
  createApplicant = (callback) => {
    let applicant = {
      first_name: 'Jane',
      last_name: 'Doe'
    }
    fetch('https://api.onfido.com/v2/applicants', {
      method: 'POST',
      headers: {
        'Authorization': "Token token="+this.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(applicant)
    })
    .then((response) => {
      if (response.ok) {
          response.json().then((responseJson) => {
            let applicantId = responseJson.id
            console.log(applicantId)
            callback(applicantId)
          })
      } else {
        this.setTextContent("Unable to create applicant", "Applicant Id is required to initiate SDK flow. Check your internet connection or token. To try again, press \"Launch\"")
      }
    })
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
        <Button onPress={this.launchSDK}
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
