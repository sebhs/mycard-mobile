import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, Alert } from 'react-native';
import firebase from "firebase";
import firestore from "./../firebase"

export default class AuthScreen extends React.Component {
    static navigationOptions = {
      title: 'Please log in',
    };
  
    render() {
      return (
        <View style={styles.container}>
          <Button title="Sign Up!" onPress={this.loginUser} />
        </View>
      );
    }
  
    loginUser = () => {
      const user = {
        email: "neo.davis@gmail.com",
        password: "password12345"
      };
      return firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(loginObj => {
          //loginObj = JSON.parse(JSON.stringify(loginObj)); //this is the weirdest thing ever - no idea why I have to do this... but doesn't work without it WTF!
          this.props.navigation.navigate("SignupFlow");
        })
        .catch(err => {
          console.error(err);
          Alert.alert(err); 
        });
    };
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
  