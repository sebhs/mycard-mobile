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
  KeyboardAvoidingView,
  ScrollView
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

export default class SocialMedia extends React.Component {
  constructor() {
    super();
    this.state = {
      loaded: false
    };
  }

  LinkedInFieldRef = React.createRef();
  InstagramFieldRef = React.createRef();
  FacebookFieldRef = React.createRef();
  SnapChatFieldRef = React.createRef();
  GitHubFieldRef = React.createRef();

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
    const { current: LinkedIn } = this.LinkedInFieldRef;
    const { current: Instagram } = this.InstagramFieldRef;
    const { current: Facebook } = this.FacebookFieldRef;
    const { current: SnapChat } = this.SnapChatFieldRef;
    const { current: GitHub } = this.GitHubFieldRef;
  };
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
        >
          <View style={styles.message}>
            <Text style={{ fontFamily: "PoiretOne", fontSize: 28 }}>
              Add your Social Media
            </Text>
          </View>
          <View style={styles.inputField}>
            <ScrollView>
              <TextField
                label="LinkedIn"
                tintColor="#0e76a8"
                onChangeText={this.formatText}
                onSubmitEditing={this.onSubmit}
                ref={this.LinkedInFieldRef}
              />
              <TextField
                label="Instagram"
                tintColor="#8134AF"
                onChangeText={this.formatText}
                onSubmitEditing={this.onSubmit}
                ref={this.InstagramFieldRef}
              />
              <TextField
                label="Facebook"
                tintColor="#3b5998"
                onChangeText={this.formatText}
                onSubmitEditing={this.onSubmit}
                ref={this.FacebookFieldRef}
              />
              <TextField
                label="Snapchat"
                tintColor="#FFFC00"
                onChangeText={this.formatText}
                onSubmitEditing={this.onSubmit}
                ref={this.SnapChatFieldRef}
              />
              <TextField
                label="GitHub"
                tintColor="#333333"
                onChangeText={this.formatText}
                onSubmitEditing={this.onSubmit}
                ref={this.GitHubFieldRef}
              />
                   <TouchableOpacity style={styles.button} onPress={this.handleNext}>
                <Text style={styles.buttontext}>Next</Text>
              </TouchableOpacity>
            </ScrollView>
    
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}
