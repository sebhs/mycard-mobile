import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Dimensions,
  Button,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import {
  TextField,
  FilledTextField,
  OutlinedTextField
} from "react-native-material-textfield";
import { createStackNavigator } from "react-navigation-stack";

import firestore from "../firebase";
import firebase from "firebase";

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: ""
    };
  }

  emailFieldRef = React.createRef();
  passwordFieldRef = React.createRef();

  onSubmit = () => {
    Keyboard.dismiss();

    let { current: email } = this.emailFieldRef;

    console.log(email.value());
  };

  handleLogin = () => {
    const { current: email } = this.emailFieldRef;
    const { current: password } = this.passwordFieldRef;
    if (email.value().trim() !== "" && password.value().trim() !== "") {
      const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (
        !email
          .value()
          .trim()
          .match(emailRegEx)
      ) {
        Alert.alert("Invalid Email", "Please choose a valid email");
        return;
      }

      loginBody = {
        email: email.value(),
        password: password.value()
      };
      this.loginUser(loginBody);
    } else {
      Alert.alert("Fields incomplete", "Please fill out all the fields");
      return;
    }
  };
  loginUser = loginBody => {
    // const { valid, errors } = validateLoginData(user); TODO: validate Data when login
    return firebase
      .auth()
      .signInWithEmailAndPassword(loginBody.email, loginBody.password)
      .then(loginObj => {
        //loginObj = JSON.parse(JSON.stringify(loginObj)); //this is the weirdest thing ever - no idea why I have to do this... but doesn't work without it WTF!
        this.props.navigation.navigate("App");
      })
      .catch(err => {
        console.log(err);
        Alert.alert("Login failed", "Email and password do not match");
      });
  };

  formatText = text => {
    return text.replace(/[^+\d]/g, "");
  };

  render() {
    return (
      <SafeAreaView style={styles.areaView}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.container}>
            <View style={styles.logo}>
              <Image
                source={require("../assets/img/mycardlogo.png")}
                style={styles.logo}
              />
            </View>
            <View style={styles.welcome}>
              <Text style={{ fontFamily: "Nunito-Light", fontSize: 23 }}>
                Welcome to{" "}
                <Text style={{ fontFamily: "PoiretOne" }}>
                  my<Text style={{ color: "#389EFF", fontSize: 32 }}>.</Text>
                  card
                </Text>
              </Text>
            </View>
            <View style={styles.input}>
              <TextField
                label="email"
                keyboardType="email-address"
                onChangeText={this.formatText}
                onSubmitEditing={this.onSubmit}
                ref={this.emailFieldRef}
              />
              <TextField
                label="password"
                onChangeText={this.formatText}
                onSubmitEditing={this.onSubmit}
                secureTextEntry={true}
                ref={this.passwordFieldRef}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={this.handleLogin}
              >
                <Text style={styles.buttontext}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  areaView: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  container: {
    flex: 1,
    padding: "7%",
    justifyContent: "flex-start"
  },
  logo: {
    paddingTop: "10%",
    flex: 1.2,
    resizeMode: "contain",
    // width: Dimensions.get("window").width * 0.7,
    alignSelf: "center"
  },
  welcome: {
    flex: 0.5,
    alignSelf: "center",
    justifyContent: "center"
  },
  input: {
    flex: 6
  },
  button: {
    borderRadius: 100,
    margin: 30,
    textAlign: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 13 }
  },
  buttontext: {
    fontFamily: "Nunito-Light",
    color: "#389EFF",
    fontSize: 23
  }
});
