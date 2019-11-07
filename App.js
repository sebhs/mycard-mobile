import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Share
} from "react-native";
import { Signup, Home } from "./Components";
import * as Font from "expo-font";
import * as Contacts from "expo-contacts";
import newLinking from "expo/build/Linking/Linking";

const api = "https://us-central1-mycard-93892.cloudfunctions.net/api";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center"
  }
});

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loaded: false
    };
  }
  componentDidMount() {
    Contacts.getContactsAsync({
      name:"Reactor"
    })
      // .then(data => {
      //   console.log(data);
      //   let testContact = {
      //     contactType: "person",
      //     firstName: "TestReacteNative first",
      //     imageAvailable: false,
      //     lastName: "TestReacteNative last",
      //     name: "TestReacteNative full name"
      //   };
      //   return Contacts.addContactAsync(testContact);
      // })
      .then(data => {
        console.log(data);
        //690276B5-F0F1-41CB-B32D-F8253E880D2F:ABPerson
        // return Contacts.presentFormAsync(null,null,{isNew:true,shouldShowLinkedContacts:true} );
        
      
      })
      // .then(idk => {
      //   console.log(idk)
      //   // Share.share({ url: localUri});
      // })
      .catch(err => {
        console.log(err);
      });

    Font.loadAsync({
      PoiretOne: require("./assets/fonts/PoiretOne-Regular.ttf"),
      "Nunito-Light": require("./assets/fonts/Nunito-Light.ttf"),
      "Nunito-Regular": require("./assets/fonts/Nunito-Regular.ttf")
    }).then(() => {
      this.setState({ loaded: true });
    });
  }
  signup = signupBody => {
    this.setState({ loaded: false });
    console.log(signupBody);
    fetch(`${api}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: signupBody.email,
        password: signupBody.password,
        confirmPassword: signupBody.confirmPassword
      })
    })
      .then(res => {
        console.log(res);
        Alert.alert("Sign up complete", errres);
      })
      .catch(err => {
        console.log(err);
        Alert.alert("Error during Signup", err);
      });
  };

  render() {
    {
      if (!this.state.loaded) {
        return (
          <View style={styles.loadingScreen}>
            <ActivityIndicator />
          </View>
        );
      }
    }
    return (
      <SafeAreaView style={styles.container}>
        {/* <Signup signup={this.signup} /> */}
        <Home />

        
      </SafeAreaView>
    );
  }
}
