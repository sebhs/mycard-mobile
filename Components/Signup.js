import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Keyboard,
  ActivityIndicator,
  TouchableWithoutFeedback
} from "react-native";
import { TextField } from "react-native-material-textfield";
import firestore from "../firebase";
import firebase from "firebase";

export default class Signup extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      loading:false
    };
  }

  emailFieldRef = React.createRef();
  passwordFieldRef = React.createRef();
  confirmPasswordFieldRef = React.createRef();

  onSubmit = () => {
    Keyboard.dismiss();

    let { current: email } = this.emailFieldRef;

    console.log(email.value());
  };

  handleSignup = () => {
    const { current: email } = this.emailFieldRef;
    const { current: password } = this.passwordFieldRef;
    const { current: confirmPassword } = this.confirmPasswordFieldRef;
    if (
      email.value().trim() !== "" &&
      password.value().trim() !== "" &&
      confirmPassword.value().trim() !== ""
    ) {
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
      if (password.value().trim() !== confirmPassword.value().trim()) {
        Alert.alert(
          "Passwords don't match",
          "Please make sure passwords match"
        );
        return;
      }
      signupBody = {
        email: email.value(),
        password: password.value(),
        confirmPassword: confirmPassword.value()
      };
      this.signupUser(signupBody)
    } else {
      Alert.alert("Fields incomplete", "Please fill out all the fields");
      return;
    }
    
  };
  signupUser = signupBody => {
    this.setState({loading:true});
    return firebase
      .auth()
      .createUserWithEmailAndPassword(signupBody.email, signupBody.password)
      .then(data => {
        const userID = data.user.uid;
        const userCredentials = {
          email: signupBody.email,
          createdAt: new Date().toISOString(),
          userID,
          currentCard: ""
        };
        return firestore.doc(`/users/${userCredentials.userID}`).set(userCredentials);
      }).then(() => {
        this.props.navigation.navigate("SignupFlow");
      })
      .catch(err => {
        this.setState({loading:false});
        console.log(err);
        Alert.alert("Signup failed");
      });

  };

  handleSignupTEST = () => {
    this.props.navigation.navigate("SignupFlow");
  };

  moveToLogin = () => {
    this.props.navigation.navigate("Login");
  };
  formatText = text => {
    return text.replace(/[^+\d]/g, "");
  };

  render() {
    {
      if (this.state.loading) {
        return (
          <View style={styles.loadingScreen}>
            <ActivityIndicator />
          </View>
        );
      }
    }
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
                autoCapitalize="none"
                ref={this.emailFieldRef}
              />
              <TextField
                label="password"
                onChangeText={this.formatText}
                onSubmitEditing={this.onSubmit}
                secureTextEntry={true}
                ref={this.passwordFieldRef}
              />
              <TextField
                label="confirm password"
                onChangeText={this.formatText}
                onSubmitEditing={this.onSubmit}
                secureTextEntry={true}
                ref={this.confirmPasswordFieldRef}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={this.handleSignup}
              >
                <Text style={styles.buttontext}>Sign Up</Text>
              </TouchableOpacity>
              <View style={styles.goToLoginClick}>
                <TouchableWithoutFeedback onPress={this.moveToLogin}>
                  <Text style={styles.goToLoginText}>
                    Already a user? Click here to Login
                  </Text>
                </TouchableWithoutFeedback>
              </View>
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
  },
  goToLoginClick: {
    flex: 0.5,
    padding: "5%",
    textAlign: "center",
    alignItems: "center"
  },
  goToLoginText: {
    textDecorationLine: "underline",
    fontFamily: "Nunito-Light",
    color: "#A9A9A9",
    fontSize: 16
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center"
  },
});
