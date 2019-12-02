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

import { WebView } from "react-native-webview";
import { Constants } from "expo";
import * as FileSystem from "expo-file-system";

import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";

import { BarCodeScanner } from "expo-barcode-scanner";

const styles = StyleSheet.create({
  WebViewContainer: {
    flex: 1
  }
});
const ServerURL =
  "https://firebasestorage.googleapis.com/v0/b/mycard-93892.appspot.com";
export default class CameraView extends React.Component {
  //   constructor() {
  //     super();
  //     this.state = {};
  //   }

  //   async componentDidMount() {
  //     const { status } = await Permissions.askAsync(Permissions.CAMERA);
  //     this.setState({ hasCameraPermission: status === "granted" });
  //   }

  //   render() {
  //     const { hasCameraPermission } = this.state;
  //     if (hasCameraPermission === null) {
  //       return <View />;
  //     } else if (hasCameraPermission === false) {
  //       return <Text>No access to camera</Text>;
  //     } else {
  //       return (
  //         <View style={{ flex: 1 }}>
  //           <Camera style={{ flex: 1 }}>

  //           </Camera>
  //         </View>
  //       );
  //     }
  //   }
  // }

  state = {
    hasCameraPermission: null,
    scanned: false
  };

  async componentDidMount() {
    this.getPermissionsAsync();
  }

  downloadContact = uri => {
    FileSystem.downloadAsync(uri)
      .then(({ uri }) => {
        console.log("Finished downloading to ", uri);
        this.setState({ scanned: false });
      })
      .catch(error => {
        console.error(error);
      });
  };

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  };

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-end",
          height: "50%",
          width: "100%"
        }}
      >
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true });
    if (
      type !== `org.iso.QRCode` ||
      !data.startsWith(
        "https://firebasestorage.googleapis.com/v0/b/mycard-93892.appspot.com"
      )
    ) {
      //Alert.alert("Invalid mycard QR code"); 
      Alert.alert(
        'Invalid QR code',
        "Seems like you didn't scan a my.card QR code 🙃" ,
        [        
          { text: 'OK', onPress: () => this.setState({ scanned: false }) },
        ],
        { cancelable: false }
      );
    } else {
      const cardID = data.match(new RegExp("o/" + "(.*)" + ".vcf"))[1];
      const { API, getCurrentAccessToken } = this.props;
      console.log(`API: ${API} getCurrentAccessToken${getCurrentAccessToken}`)
      fetch(`${API}/addCard/${cardID}`, {
        headers: new Headers({
          Authorization: "Bearer " + getCurrentAccessToken()
        })
      })
        .then(() => {
          this.setState({ scanned: false });
        })
        .catch(err => {
          console.error(err);
        });
    }
    //this.downloadContact(data)
    console.log(
      `Bar code with type ${type} and data ${data} has been scanned!`
    );
  };
}
