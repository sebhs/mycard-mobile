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
import PhoneInput from "react-native-phone-input";

export default class InputName extends React.Component {
  constructor() {
    super();
    this.state = {
      loaded: false
    };
  }

  FirstNameRef = React.createRef();
  LastNameRef = React.createRef();

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
    const { current: FirstName } = this.FirstNameRef;
    const { current: LastName } = this.LastNameRef;
    const name = {
      firstName: FirstName.value(),
      lastName: LastName.value(),
      fullName: `${FirstName.value()} ${LastName.value()}`
    }
    this.props.navigation.navigate('CreateContact', {name: name})
  };
  render() {
    return (
      <SafeAreaView style={styles.areaView}>
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
              <Text style={{ fontFamily: "PoiretOne", fontSize: 24 }}>
                Your Name
              </Text>
            </View>
            <View style={styles.inputField}>
              <ScrollView>
                <TextField
                  label="First Name"
                  tintColor="#389EFF"
                  onChangeText={this.formatText}
                  onSubmitEditing={this.onSubmit}
                  ref={this.FirstNameRef}
                />
                 <TextField
                  label="Last Name"
                  tintColor="#389EFF"
                  onChangeText={this.formatText}
                  onSubmitEditing={this.onSubmit}
                  ref={this.LastNameRef}
                />
                {/* <PhoneInput
                  ref={ref => {
                    this.phone = ref;
                  }}
                /> */}

                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleNext}
                 
                >
                  <Text style={styles.buttontext}>Next</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
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
  // input: {
  //   flex: 1
  // },
  // SocialLogo: {
  //   width: 20,
  //   height: 20
  // },
  // fieldWrapper: {
  //   flex: 1,
  //   flexDirection: "row"
  //   // justifyContent: 'center',
  //   // alignItems: 'center',
  // }
});
