import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import firebase from "firebase";
import firestore from "./../firebase"
import * as Font from "expo-font";

//TODO: ask for permission to use contacts (only allow with contacts) and maybe camera?
export default class AuthLoadingScreen extends React.Component {
   componentDidMount() {
    Font.loadAsync({
      PoiretOne: require("./../assets/fonts/PoiretOne-Regular.ttf"),
      "Nunito-Light": require("./../assets/fonts/Nunito-Light.ttf"),
      "Nunito-Regular": require("./../assets/fonts/Nunito-Regular.ttf")
    }).then(() => {
      let loggedIn = false;
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          loggedIn = true;
        } else {
          loggedIn = false;
        }
      });
      this.props.navigation.navigate(loggedIn ? 'App' : 'Signup');
    })

  }
  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
  });