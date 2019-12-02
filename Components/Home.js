import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Button,
  TouchableOpacity,
  Share,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  AsyncStorage
} from "react-native";
import {
  TextField,
  FilledTextField,
  OutlinedTextField
} from "react-native-material-textfield";
import * as FileSystem from "expo-file-system";
import { QRCode } from "react-native-custom-qr-codes-expo";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import Swiper from "react-native-swiper";
import randomcolor from "randomcolor";
import CameraView from "./CameraView";
import firebase from "firebase";
import firestore from "./../firebase"
import * as Contacts from "expo-contacts";
import {reduceContact} from "../util"


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "5%",
    justifyContent: "flex-start"
  },
  imageView: {
    padding: "10%",
    flex: 1,
    alignSelf: "center",
    resizeMode: "contain"
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  nameView: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center"
  },
  qrcodeView: {
    flex: 4,
    alignSelf: "center",
    justifyContent: "center"
  },
  cameraButtonView: {
    flex: 1
  },
  cameraButton: {
    marginTop: 20,
    width: "80%",
    height: "80%",
    alignItems: "center",
    alignSelf: "center"
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center"
  }
});

var base64Icon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRF7c5J78kt+/Xm78lQ6stH5LI36bQh6rcf7sQp671G89ZZ8c9V8c5U9+u27MhJ/Pjv9txf8uCx57c937Ay5L1n58Nb67si8tVZ5sA68tJX/Pfr7dF58tBG9d5e8+Gc6chN6LM+7spN1pos6rYs6L8+47hE7cNG6bQc9uFj7sMn4rc17cMx3atG8duj+O7B686H7cAl7cEm7sRM26cq/vz5/v767NFY7tJM78Yq8s8y3agt9dte6sVD/vz15bY59Nlb8txY9+y86LpA5LxL67pE7L5H05Ai2Z4m58Vz89RI7dKr+/XY8Ms68dx/6sZE7sRCzIEN0YwZ67wi6rk27L4k9NZB4rAz7L0j5rM66bMb682a5sJG6LEm3asy3q0w3q026sqC8cxJ6bYd685U5a457cIn7MBJ8tZW7c1I7c5K7cQ18Msu/v3678tQ3aMq7tNe6chu6rgg79VN8tNH8c0w57Q83akq7dBb9Nld9d5g6cdC8dyb675F/v327NB6////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/LvB3QAAAMFJREFUeNpiqIcAbz0ogwFKm7GgCjgyZMihCLCkc0nkIAnIMVRw2UhDBGp5fcurGOyLfbhVtJwLdJkY8oscZCsFPBk5spiNaoTC4hnqk801Qi2zLQyD2NlcWWP5GepN5TOtSxg1QwrV01itpECG2kaLy3AYiCWxcRozQWyp9pNMDWePDI4QgVpbx5eo7a+mHFOqAxUQVeRhdrLjdFFQggqo5tqVeSS456UEQgWE4/RBboxyC4AKCEI9Wu9lUl8PEGAAV7NY4hyx8voAAAAASUVORK5CYII=";

const API = "https://us-central1-mycard-93892.cloudfunctions.net/api";

class TitleText extends React.Component {
  render() {
    return (
      <Text style={{ fontSize: 48, color: "white" }}>{this.props.label}</Text>
    );
  }
}
export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      contact: {},
      imageLoaded: false,
      userLoggedIn: false,
      token: 0,
      imgURI: "",
      swipeIndex: 0,
      currentUserID:""
    };
  }

  componentDidMount() {
    // try {
    //   let img = await FileSystem.readAsStringAsync(
    //     this.state.contact.image.uri,
    //     {
    //       encoding: FileSystem.EncodingType.Base64
    //     }
    //   );
    //   img = `data:image/png;base64,${img}`;
    //   this.setState({ imageLoaded: true, img: img });
    // } catch (err) {
    //   console.log(err);
    // }
    // const { status } = await Permissions.askAsync(Permissions.CAMERA);
    // this.setState({ hasCameraPermission: status === "granted" });

    this.loginUser()
      .then(() => {
        
        return this.getCurrentCard();
      })
      .then(contact => {
        if (contact.code) {
          //there was login error
          Alert.alert(`Error code: ${contact.code}`);
          //TODO: handle expired token
        } else {
          this.setState({
            userLoggedIn: true,
            contact: contact
          });
          this.getImageURI();
          this.listenOnContacts();
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  getCurrentUserID = () => {
    let { currentUser } = firebase.auth();
    //console.log(currentUser)
    currentUser = JSON.parse(JSON.stringify(currentUser)); //this is the weirdest thing ever - no idea why I have to do this... but doesn't work without it WTF!
    return currentUser.uid;
  }
  getCurrentAccessToken = () => {
    let { currentUser } = firebase.auth();
    currentUser = JSON.parse(JSON.stringify(currentUser)); //this is the weirdest thing ever - no idea why I have to do this... but doesn't work without it WTF!
    return currentUser.stsTokenManager.accessToken;
  };

  handleNewContact = () => {
    //TODO: decompose below
  }

  listenOnContacts = () => {
    const contactsRef = firestore.doc(`/users/${this.getCurrentUserID()}`).collection("contacts")
    this.unsubscribe = contactsRef.onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        const contactObj = change.doc.data();
        if(contactObj.internalContactID === "") {
          console.log('ADDED: ', JSON.stringify(change.doc.data()));
          ///Decompose///
          let reducedContact = contactObj.contactBody.contactInfo 
          if(reducedContact.rawImage) {
              delete reducedContact.rawImage;
          }
          if(reducedContact.imageAvailable) {
              delete reducedContact.imageAvailable;
          }
          if(reducedContact.image) {
              delete reducedContact.image;
          }
          if(reducedContact.id) {
              delete reducedContact.id;
          }
          let internalContactID =""
          ///////////////////////
          Contacts.addContactAsync(reducedContact)
          .then(contactId => {
            //save in DB
            internalContactID = contactId;
            return contactsRef
            .doc(contactObj.cardID)
            .update({
              internalContactID:internalContactID
            })
          }).then(() => {
            return Contacts.presentFormAsync(internalContactID,null, {
              cancelButtonTitle:"Add"
            })
          })
          .catch(err => { 
            console.error(err)
            //File 'file:///var/mobile/Containers/Data/Application/22DD1929-6E33-4163-80B1-5812EAA83F57/Library/Caches/ExponentExperienceData/%2540anonymous%252Fmycard-react-native-22059536-b640-4f70-8d7c-55f1bfbc0c2a/Contacts/16B7A5A4-87D8-4AC6-ABB9-36B2357826DD:ABPerson-thumbnailImageData.png' isn't readable.
          })

        } else {
          //contact already in contact book
        }
      }
      if (change.type === 'modified') {
        console.log('Modified: ', change.doc.data());
      }
      if (change.type === 'removed') {
        console.log('Removed  ', change.doc.data());
      }
    });
  });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }
  
  loginUser = () => {
    const user = {
      email: "neo.davis@gmail.com",
      password: "password12345"
    };
    // const { valid, errors } = validateLoginData(user); TODO: validate Data when login
    return firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(loginObj => {
        loginObj = JSON.parse(JSON.stringify(loginObj)); //this is the weirdest thing ever - no idea why I have to do this... but doesn't work without it WTF!
        
       //const token = loginObj.user.stsTokenManager.accessToken;
       // return AsyncStorage.setItem("user-token", token);
      })
      .catch(err => {
        console.error(err);
      });
  };

  getImageURI = () => {
    const internalContactID = this.state.contact.contactBody.contactInfo.id;
    Contacts.getContactByIdAsync(internalContactID).then(contact => {
      if(contact) {
        this.setState({ imgURI: contact.image.uri, imageLoaded: true });
      }
    }).catch(err=> {
      console.error(err)
    })
  };

  getCurrentCard = () => {
    return fetch(`${API}/currentCard`, {
      headers: new Headers({
        Authorization: "Bearer " + this.getCurrentAccessToken()
      })
    })
      .then(res => {
        return res.json();
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  };

  retrieveToken = () => {
    return AsyncStorage.getItem("user-token")
      .then(value => {
        if (value !== null) {
          return value;
        }
        return 0;
      })
      .catch(err => {
        console.error(err);
        return 0;
      });
  };

  formatText = text => {
    return text.replace(/[^+\d]/g, "");
  };

  onClickQrCode = () => {
    //TODO: hange functionality to share button top right
    const internalContactID = this.state.contact.contactBody.contactInfo.id;
    Contacts.writeContactToFileAsync({
      id: internalContactID
    }).then(localUri => {
      Share.share({ url: localUri });
    });
  };

  viewStyle() {
    return {
      flex: 1,
      backgroundColor: randomcolor(),
      justifyContent: "center",
      alignItems: "center"
    };
  }

  render() {
    {
      if (!this.state.userLoggedIn) {
        return (
          <View style={styles.loadingScreen}>
            <ActivityIndicator />
          </View>
        );
      }
    }
    const info = this.state.contact.contactBody.contactInfo;
    return (
      <Swiper
        ref="swiper"
        loop={false}
        showsPagination={false}
        index={0}
        horizontal={false}
      >
        {/*When swiped to the top*/}
        <View style={styles.container}>
          <View style={styles.imageView}>
            {this.state.imageLoaded ? (
              <Image style={styles.img} source={{ uri: this.state.imgURI }} />
            ) : (
              // <Image style={styles.img} source={require("../assets/img/mycardlogo.png")} />

              <ActivityIndicator />
            )}
          </View>
          <View style={styles.nameView}>
            <Text style={{ fontFamily: "Nunito-Light", fontSize: 30 }}>
              Hi, I'm {info.firstName}
            </Text>
          </View>
          <View style={styles.qrcodeView}>
            <TouchableOpacity onPress={() => this.onClickQrCode()}>
              <QRCode
                content={this.state.contact.vCardUrl}
                codeStyle="dot"
                innerEyeStyle="circle"
                outerEyeStyle="circle"
                logoSize={70}
                logo={require("../assets/img/mycardlogo.png")}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.cameraButtonView}>
            <TouchableOpacity
              style={styles.bigButton}
              onPress={() => this.refs.swiper.scrollBy(1)}
            >
              <Image
                style={styles.cameraButton}
                resizeMode="contain"
                source={require("../assets/img/cameraButton.png")}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/*When swiped to the bottom*/}
        <CameraView  getCurrentAccessToken={this.getCurrentAccessToken} API={API}/>
      </Swiper>
    );
  }
}
