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
  }
});

export default class CameraView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {
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
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: "flex-end",
                  alignItems: "center"
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                  });
                }}
              >
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: "white" }}
                >
                  {" "}
                  Flip{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
