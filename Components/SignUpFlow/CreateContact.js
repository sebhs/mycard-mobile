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
  AsyncStorage,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView
} from "react-native";
import * as Font from "expo-font";
import { TextField } from "react-native-material-textfield";
import * as Contacts from "expo-contacts";
// import ContactsWrapper from "react-native-contacts-wrapper";

const api = "https://us-central1-mycard-93892.cloudfunctions.net/api";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "7%",

    backgroundColor: "#ffffff"
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center"
  },
  inputField: {
    flex: 4
  },
  message: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    fontFamily: "PoiretOne"
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

export default class CreateContact extends React.Component {
  constructor() {
    super();
    this.state = {
      loaded: false
    };
  }

  firstNameFieldRef = React.createRef();
  lastNameFieldRef = React.createRef();
  phoneNumberFieldRef = React.createRef();
  emailFieldRef = React.createRef();

  async componentDidMount() {
    // await this.retrieveToken();
    // const newContactId = await Contacts.addContactAsync();
    // await Contacts.presentFormAsync(newContactId, null, {
    //   shouldShowLinkedContacts: true
    // });
    // ContactsWrapper.getContact()
    //   .then(contact => {
    //     // Replace this code
    //     console.log(contact);
    //   })
    //   .catch(error => {
    //     console.log("ERROR CODE: ", error.code);
    //     console.log("ERROR MESSAGE: ", error.message);
    //   });
    // Contacts.presentFormAsync(null,null,{isNew:true,shouldShowLinkedContacts:true}).then
  }
  formatText = text => {
    return text.replace(/[^+\d]/g, "");
  };

  retrieveToken = async () => {
    try {
      const value = await AsyncStorage.getItem("user-token");
      if (value !== null) {
        // We have data!!
        console.log(value);
      }
    } catch (error) {
      console.err(error);
    }
  };
  handleNext = async () => {
    const { current: firstName } = this.firstNameFieldRef;
    const { current: lastName } = this.lastNameFieldRef;
    const { current: phoneNumber } = this.phoneNumberFieldRef;
    const { current: email } = this.emailFieldRef;
    if(firstName.value().trim() === "") {
      Alert.alert("Fields cannot be empty")
      return;
    }

  };
  render() {
    return (

      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <ScrollView>

          <View style={styles.message}>
            <Text style={{ fontFamily: "PoiretOne", fontSize: 32 }}>
              Create your contact
            </Text>
          </View>
          <View style={styles.inputField}>
            <TextField
              label="Your First Name"
              onChangeText={this.formatText}
              onSubmitEditing={this.onSubmit}
              ref={this.firstNameFieldRef}
            />
            <TextField
              label="Your Last Name"
              onChangeText={this.formatText}
              onSubmitEditing={this.onSubmit}
              ref={this.lastNameFieldRef}
            />
            <TextField
              label="Your Phone Number"
              onChangeText={this.formatText}
              formatText={this.formatText}
              keyboardType="phone-pad"
              onSubmitEditing={this.onSubmit}
              ref={this.phoneNumberFieldRef}
            />
            <TextField
              label="Your Email"
              onChangeText={this.formatText}
              onSubmitEditing={this.onSubmit}
              ref={this.emailFieldRef}
            />

            <TouchableOpacity style={styles.button} onPress={this.handleNext}>
              <Text style={styles.buttontext}>Next</Text>
            </TouchableOpacity>
          </View>
         </ScrollView>

        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

    );
  }
}
