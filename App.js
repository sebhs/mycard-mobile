import React from "react";
import { StyleSheet, Text, View, Image, SafeAreaView } from "react-native";
import { Signup } from "./Components";
import * as Font from 'expo-font';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  }
});

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loaded:false,
    };
  }
  componentDidMount() {
   Font.loadAsync({
      "PoiretOne": require("./assets/fonts/PoiretOne-Regular.ttf"),
      "Nunito-Light": require("./assets/fonts/Nunito-Light.ttf"),
      "Nunito-Regular": require("./assets/fonts/Nunito-Regular.ttf")
    }).then(()=> {
      this.setState({ loaded: true });
    });
    
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
       {this.state.loaded ? (<Signup />) : <Text>loading...</Text>}
      </SafeAreaView> 
    );
  }
}
