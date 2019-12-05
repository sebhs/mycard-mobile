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
import firestore from "../../firebase";
import firebase from "firebase";

const API = "https://us-central1-mycard-93892.cloudfunctions.net/api";

export default class SocialMedia extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false
    };
  }

  LinkedInFieldRef = React.createRef();
  InstagramFieldRef = React.createRef();
  FacebookFieldRef = React.createRef();
  SnapChatFieldRef = React.createRef();
  GitHubFieldRef = React.createRef();

  async componentDidMount() {
    const contactID = this.props.navigation.getParam("contactID", "");
    this.setState({contactID:contactID})
  }
  formatText = text => {
    return text.replace(/[^+\d]/g, "");
  };


  handleNext = async () => {
    const { current: LinkedIn } = this.LinkedInFieldRef;
    const { current: Instagram } = this.InstagramFieldRef;
    const { current: Facebook } = this.FacebookFieldRef;
    const { current: SnapChat } = this.SnapChatFieldRef;
    const { current: GitHub } = this.GitHubFieldRef;
    const socialMedia = {
      LinkedIn: LinkedIn.value(),
      Instagram: Instagram.value(),
      Facebook: Facebook.value(),
      SnapChat: SnapChat.value(),
      GitHub: GitHub.value(),
    }
    this.addContact(socialMedia)
  };

  addContact = async (socialMedia = {}) => {
    this.setState({loading:true})
  
    // console.log(`At fetch${this.state.contactID}`)
    // const contactID= this.state.contactID.substr(0, this.state.contactID.indexOf(':')); 
    // console.log(`At fetch${contactID}`)
    // return fetch(`${API}/currentCard`, {
    //   headers: new Headers({
    //     Authorization: "Bearer " + this.getCurrentAccessToken()
    //   })
    // })
    //   .then(res => {
    //     return res.json();
    //   })
    try {
    const contactInfo = await Contacts.getContactByIdAsync(this.state.contactID);
    if (socialMedia !== {}) {
      //TODO: add social Media to contact 
    }

    const res = await fetch(`${API}/createCard`, {
      headers: new Headers({
        Authorization: "Bearer " + this.getCurrentAccessToken(),
        'Content-Type': 'application/json'
      }),
      method: 'post',
      body: JSON.stringify({
        toUpdate: 'false',
        contactBody: {
          meta: {},
          contactInfo
        },
        internalContactID: this.state.contactID,
      })
    })
    const data = await res.json();
    console.log(data)
    if(data.error) throw data.error; //does this work?
    const mycardContactID = data.cardID
    const contactURI = await  Contacts.writeContactToFileAsync({id:this.state.contactID});
    const response = await fetch(contactURI);
    const blob = await response.blob();
    const ref = firebase.storage().ref().child(`${mycardContactID}.vcf`);
    await ref.put(blob);
    const url = await ref.getDownloadURL();
    console.log(this.getCurrentUserID())
    console.log(mycardContactID)
    const userCardRef = await firestore.doc(`/users/${this.getCurrentUserID()}`).collection("cards").doc(mycardContactID);
    await userCardRef.update({ vCardUrl: url });
    const cardRef = await firestore.doc(`/cards/${mycardContactID}`)
    await cardRef.update({ vCardUrl: url });
    this.props.navigation.navigate("Home");
  } catch(err) {
    this.setState({loading:false})
    console.log(err)
    Alert.alert("Something went wrong please try again")
  }

  }
  getCurrentUserID = () => {
    let { currentUser } = firebase.auth();
    //console.log(currentUser)
    currentUser = JSON.parse(JSON.stringify(currentUser)); //this is the weirdest thing ever - no idea why I have to do this... but doesn't work without it WTF!
    return currentUser.uid;
  };
  getCurrentAccessToken = () => {
    let { currentUser } = firebase.auth();
    currentUser = JSON.parse(JSON.stringify(currentUser)); //this is the weirdest thing ever - no idea why I have to do this... but doesn't work without it WTF!
    return currentUser.stsTokenManager.accessToken;
  };
  handleSkip = () => {
    this.addContact()
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
          <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            enabled
          >
            <View style={styles.message}>
              <Text style={{ fontFamily: "PoiretOne", fontSize: 24 }}>
                Add your Social Media
              </Text>
            </View>
            <View style={styles.inputField}>
              <ScrollView>
                <TextField
                  label="LinkedIn"
                  tintColor="#0e76a8"
                  onSubmitEditing={this.onSubmit}
                  autoCapitalize="none"
                  ref={this.LinkedInFieldRef}
                />
                <TextField
                  label="Instagram"
                  tintColor="#8134AF"
                  onSubmitEditing={this.onSubmit}
                  autoCapitalize="none"
                  ref={this.InstagramFieldRef}
                />
                <TextField
                  label="Facebook"
                  tintColor="#3b5998"
                  onSubmitEditing={this.onSubmit}
                  autoCapitalize="none"
                  ref={this.FacebookFieldRef}
                />
                <TextField
                  label="Snapchat"
                  tintColor="#FFFC00"
                  autoCapitalize="none"
                  onSubmitEditing={this.onSubmit}
                  ref={this.SnapChatFieldRef}
                />
                <TextField
                  label="GitHub"
                  tintColor="#333333"
                  autoCapitalize="none"
                  onSubmitEditing={this.onSubmit}
                  ref={this.GitHubFieldRef}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleNext}
                >
                  <Text style={styles.buttontext}>Next</Text>
                </TouchableOpacity>

                <View style={styles.skipClick}>
                  <TouchableWithoutFeedback onPress={this.handleSkip}>
                    <Text style={styles.skipText}>skip</Text>
                  </TouchableWithoutFeedback>
                </View>
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
    flex: 6
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
  },
  skipClick: {
    textAlign: "center",
    alignItems: "center"
  },
  skipText: {
    textDecorationLine: "underline",
    fontFamily: "Nunito-Light",
    color: "#A9A9A9",
    fontSize: 16
  },
  
});
