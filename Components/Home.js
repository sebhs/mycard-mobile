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
  Alert,
  Keyboard,
  TouchableWithoutFeedback
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
import CameraView from './CameraView'

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
});
const link_qr =
  "https://firebasestorage.googleapis.com/v0/b/mycard-93892.appspot.com/o/5f8ba560-c43c-11e9-b2ed-a1df55fb68ac.vcf?alt=media";

var base64Icon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRF7c5J78kt+/Xm78lQ6stH5LI36bQh6rcf7sQp671G89ZZ8c9V8c5U9+u27MhJ/Pjv9txf8uCx57c937Ay5L1n58Nb67si8tVZ5sA68tJX/Pfr7dF58tBG9d5e8+Gc6chN6LM+7spN1pos6rYs6L8+47hE7cNG6bQc9uFj7sMn4rc17cMx3atG8duj+O7B686H7cAl7cEm7sRM26cq/vz5/v767NFY7tJM78Yq8s8y3agt9dte6sVD/vz15bY59Nlb8txY9+y86LpA5LxL67pE7L5H05Ai2Z4m58Vz89RI7dKr+/XY8Ms68dx/6sZE7sRCzIEN0YwZ67wi6rk27L4k9NZB4rAz7L0j5rM66bMb682a5sJG6LEm3asy3q0w3q026sqC8cxJ6bYd685U5a457cIn7MBJ8tZW7c1I7c5K7cQ18Msu/v3678tQ3aMq7tNe6chu6rgg79VN8tNH8c0w57Q83akq7dBb9Nld9d5g6cdC8dyb675F/v327NB6////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/LvB3QAAAMFJREFUeNpiqIcAbz0ogwFKm7GgCjgyZMihCLCkc0nkIAnIMVRw2UhDBGp5fcurGOyLfbhVtJwLdJkY8oscZCsFPBk5spiNaoTC4hnqk801Qi2zLQyD2NlcWWP5GepN5TOtSxg1QwrV01itpECG2kaLy3AYiCWxcRozQWyp9pNMDWePDI4QgVpbx5eo7a+mHFOqAxUQVeRhdrLjdFFQggqo5tqVeSS456UEQgWE4/RBboxyC4AKCEI9Wu9lUl8PEGAAV7NY4hyx8voAAAAASUVORK5CYII=";

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
      contact: {
        company: "Stanford",
        contactType: "person",
        emails: [
          {
            email: "sebhs@stanford.edu",
            id: "F3C2342B-66EE-4759-9AF1-82DBA80FF98C",
            label: "home"
          }
        ],
        firstName: "Reactor",
        id: "690276B5-F0F1-41CB-B32D-F8253E880D2F:ABPerson",
        image: {
          height: 345,
          uri:
            "file:///var/mobile/Containers/Data/Application/22DD1929-6E33-4163-80B1-5812EAA83F57/Library/Caches/ExponentExperienceData/%2540anonymous%252Fmycard-react-native-22059536-b640-4f70-8d7c-55f1bfbc0c2a/Contacts/690276B5-F0F1-41CB-B32D-F8253E880D2F:ABPerson-imageData.png",
          width: 345
        },
        imageAvailable: true,
        lastName: "Mycardus",
        name: "Reactor Mycardus",
        phoneNumbers: [
          {
            countryCode: "us",
            digits: "+16502780825",
            id: "3BC54A38-CF3E-48CC-9B77-194ABB70BBDD",
            label: "home",
            number: "+1 (650) 278-0825"
          }
        ],
        rawImage: {
          height: 3088,
          uri:
            "file:///var/mobile/Containers/Data/Application/22DD1929-6E33-4163-80B1-5812EAA83F57/Library/Caches/ExponentExperienceData/%2540anonymous%252Fmycard-react-native-22059536-b640-4f70-8d7c-55f1bfbc0c2a/Contacts/690276B5-F0F1-41CB-B32D-F8253E880D2F:ABPerson-imageData.png",
          width: 2320
        },
        socialProfiles: [
          {
            id: "18C1AF13-38CF-4D93-B1BD-482CBC9BFC8F",
            label: "LinkedIn",
            localizedService: "LinkedIn",
            service: "LinkedIn",
            url: "http://www.linkedin.com/in/sebhs",
            username: "sebhs"
          }
        ]
      },
      imageLoaded: false,
      img: ""
    };
  }

  async componentDidMount() {
    try {
      let img = await FileSystem.readAsStringAsync(
        this.state.contact.image.uri,
        {
          encoding: FileSystem.EncodingType.Base64
        }
      );
      img = `data:image/png;base64,${img}`;
      this.setState({ imageLoaded: true, img: img });
    } catch (e) {
      console.log(err);
    }
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  formatText = text => {
    return text.replace(/[^+\d]/g, "");
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
    return (
      <Swiper loop={false} showsPagination={false} index={0} horizontal={false}>
        {/*When swiped to the top*/}
        <View style={styles.container}>
          <View style={styles.imageView}>
            {this.state.imageLoaded ? (
              <Image style={styles.img} source={{ uri: this.state.img }} />
            ) : (
              <ActivityIndicator />
            )}
          </View>
          <View style={styles.nameView}>
            <Text style={{ fontFamily: "Nunito-Light", fontSize: 30 }}>
              Hi, I'm {this.state.contact.firstName}
            </Text>
          </View>
          <View style={styles.qrcodeView}>
            <TouchableOpacity>
              <QRCode
                content={link_qr}
                codeStyle="dot"
                innerEyeStyle="circle"
                outerEyeStyle="circle"
                logoSize={70}
                logo={require("../assets/img/mycardlogo.png")}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.cameraButtonView}>
            <TouchableOpacity style={styles.bigButton}>
              <Image
                style={styles.cameraButton}
                resizeMode="contain"
                source={require("../assets/img/cameraButton.png")}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/*When swiped to the bottom*/}
        <CameraView/>
      </Swiper>
    );


    // return (
    //   <View style={styles.container}>
    //     <View style={styles.imageView}>
    //       {this.state.imageLoaded ? (
    //         <Image style={styles.img} source={{ uri: this.state.img }} />
    //       ) : (
    //         <ActivityIndicator />
    //       )}
    //     </View>
    //     <View style={styles.nameView}>
    //       <Text style={{ fontFamily: "Nunito-Light", fontSize: 30 }}>
    //         Hi, I'm {this.state.contact.firstName}
    //       </Text>
    //     </View>
    //     <View style={styles.qrcodeView}>
    //       <TouchableOpacity>
    //         <QRCode
    //           content={link_qr}
    //           codeStyle="dot"
    //           innerEyeStyle="circle"
    //           outerEyeStyle="circle"
    //           logoSize={70}
    //           logo={require("../assets/img/mycardlogo.png")}
    //         />
    //       </TouchableOpacity>
    //     </View>
    //     <View style={styles.cameraButtonView}>
    //       <TouchableOpacity style={styles.bigButton}>
    //         <Image
    //           style={styles.cameraButton}
    //           resizeMode="contain"
    //           source={require("../assets/img/cameraButton.png")}
    //         />
    //       </TouchableOpacity>
    //     </View>
    //   </View>
    // );
    // }
  }
}
