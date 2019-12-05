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
  ScrollView,
  Permissions
} from "react-native";
import * as Font from "expo-font";
import { TextField } from "react-native-material-textfield";
import * as Contacts from "expo-contacts";
// import ContactsWrapper from "react-native-contacts-wrapper";

const api = "https://us-central1-mycard-93892.cloudfunctions.net/api";

export default class CreateContact extends React.Component {
  constructor() {
    super();
    this.state = {
        contactID: 0
    };
  }



  async componentDidMount() {
    const name = this.props.navigation.getParam("name", "");
    console.log(name);
    try {
      const { data } = await Contacts.getContactsAsync({
        name: name.fullName

      });
      if (data.length > 0) {
        const contact = data[0]; //TODO: handle multiple contacts
        this.setState({contactID: contact.id})
        this.editContact(contact.id)
      } else {
        const contact = {
            [Contacts.Fields.FirstName]: name.firstName,
            [Contacts.Fields.LastName]: name.lastName,
          };
          const contactID = await Contacts.addContactAsync(contact);
          this.setState({contactID: contactID})
          this.editContact(contactID)
      }
    } catch (err) {
      console.log(err);
    }
  }

  editContact = async (contactID) => {
    await Contacts.presentFormAsync(contactID,null, {
        cancelButtonTitle: "Done"
    });
    Alert.alert(
        'Edit your account',
        'Hit edit and add the information you want to share',
        [             
          {text: 'Got it!'},
        ],
        {cancelable: false},
      );
  }

  handleNext = async () => {
    this.props.navigation.navigate('SocialMedia', {contactID: this.state.contactID})
  };
  handleEditContact = async () => {
    this.editContact(this.state.contactID)
  };

  render() {
    return (
      <SafeAreaView style={styles.areaView}>
        <View style={styles.message}>
          <Text style={{ fontFamily: "PoiretOne", fontSize: 24 }}>
            Done? Just hit next!
          </Text>
        </View>
        <View style={styles.inputField}>
          <TouchableOpacity style={styles.button} onPress={this.handleEditContact}>
            <Text style={styles.buttontext}>Edit Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.handleNext}>
            <Text style={styles.buttontext}>Next</Text>
          </TouchableOpacity>
        </View>
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
});
