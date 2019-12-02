import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Share,
  AsyncStorage
} from "react-native";
import { Home } from "./Components";
import * as signUpFlow from "./Components/SignUpFlow"
import * as Font from "expo-font";
import * as Contacts from "expo-contacts";
import { createStackNavigator } from 'react-navigation-stack';

const testTokenNeo= "eyJhbGciOiJSUzI1NiIsImtpZCI6IjRhOWEzMGI5ZThkYTMxNjY2YTY3NTRkZWZlZDQxNzQzZjJlN2FlZWEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbXljYXJkLTkzODkyIiwiYXVkIjoibXljYXJkLTkzODkyIiwiYXV0aF90aW1lIjoxNTc0NzM1ODA5LCJ1c2VyX2lkIjoiQVlzQkNMVlJYWVdRb2ZKRWw5Uk05V2lsNEVJMyIsInN1YiI6IkFZc0JDTFZSWFlXUW9mSkVsOVJNOVdpbDRFSTMiLCJpYXQiOjE1NzQ3MzU4MDksImV4cCI6MTU3NDczOTQwOSwiZW1haWwiOiJuZW8uZGF2aXNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbIm5lby5kYXZpc0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.NbTtPD6p7MlCPxkGpYR2wOPEZsr1CT8ZHyMt3ZL6WFXBdiP-xdtG1uY1uKW0Aceh0hCcqRNqIZpyqXRCtM1AW8nUVmdhvMo_E0wHSxKy3-qc14SCci3JcxkQlharhh66Vu3jUFGr1ncDtRb5NsBrTfNDu8KH05_l2AAILpcmjH7L-tyxxfBYHf2WwVNLtKowQI2i4QazI38843G_jWx29bOCZ2UWbU10AfLeJaE-3vJ9DK4oKBcs1ggenAzKi3DyVfUMmTypbsakMBjYbuI6ZhDRo-cCslUQawVYtUd9T_e9gt5xOYmSYTNlPlzI_a1_6VxCVqa3e94Fk7z3awc35g"
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

// const StackNav = createStackNavigator({
//   Signup: {screen: pages.Signup},
//   CreateContact: {screen: pages.CreateContact},
//   SocialMedia: {screen: pages.SocialMedia},
// },{
//   initialRouteName: 'Signup',
//   // mode: 'modal',
// });

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loaded: false
    };
  }

  
  componentDidMount() {

    Contacts.getContactsAsync({
      name: "Doris Baker"
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
        // console.log(JSON.stringify(data.data[0]))
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
      return this.storeToken(testTokenNeo)
    }).then(() => {
      this.setState({ loaded: true });
    })



  }
  signup = signupBody => {
    this.setState({ loaded: false });
    // console.log(signupBody);
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
        return res.json();
      })
      .then(data => {
        //TODO: Handle if user is already exsisting
        //To handle
        //"error": "auth/weak-password"
        if (!"token" in data) {
          //something went wrong with signup
          if ("error" in data) Alert.alert(`Error: ${data.error}`);
          this.setState({ loaded: true });
        } else {
          //got token
          this.storeToken(data.token).then(data => {

          })
          .catch(err=> {
            console.log(`Error while storing token: ${err}`)
          })
          
          this.setState({ loaded: true });
        }
      })
      .catch(err => {
        console.error(err);
        Alert.alert("Error during Signup", err);
      });
  };

  storeToken = token => {
    return AsyncStorage.setItem("user-token", token)
  };

  // _retrieveData = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem('TASKS');
  //     if (value !== null) {
  //       // We have data!!
  //       console.log(value);
  //     }
  //   } catch (error) {
  //     // Error retrieving data
  //   }
  // };

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
        {/* <SocialMedia/> */}
      </SafeAreaView>
    );
  }
}
