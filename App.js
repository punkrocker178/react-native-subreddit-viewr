/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  FlatList,
  VirtualizedList,
  Image,
  TouchableOpacity,
  Linking
} from "react-native";

import images from "./Icons/index";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});



type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      isLoading: true,
      dataSource: null
    };
    this.hardwareImage = this.hardwareImage.bind(this);
    this.handleURL = this.handleURL.bind(this);
    this.getData = this.getData.bind(this);
  }

  hardwareImage(flair_text) {
    let img;
    if (flair_text == null) {
      img = images.Other;
    } else {
      switch (flair_text.toLowerCase()) {
        case "monitor":
          img = images.Monitor;
          break;
        case "cpu":
          img = images.CPU;
          break;
        case "gpu":
          img = images.GPU;
          break;
        case "psu":
          img = images.PSU;
          break;
        case "ram":
        case "memory":
          img = images.RAM;
          break;
        case "cooler":
        case "fan":
        case "cooling":
          img = images.Cooler;
          break;
        case "keyboard":
          img = images.Keyboard;
          break;
        case "mouse":
          img = images.Mouse;
          break;
        case "headphones":
          img = images.Headphones;
          break;
        case "ssd":
          img = images.SSD;
          break;
        case "motherboard":
        case "mobo":
          img = images.MOBO;
          break;
        case "controller":
          img = images.Controller;
          break;
        case "hdd":
          img = images.HDD;
          break;
        default:
          img = images.Other;
          break;
      }
    }
    return img;
  }

  //Open url in browser
  handleURL(url) {
    console.log("Opening " + url);
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Cant handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error("An error occurred", err));
  }

  getData(){
    console.log("Fetching");
    fetch("https://www.reddit.com/r/buildapcsales.json?limit=50")
      .then(response => {
        return response.json();
      })
      .then(responseJSON => {
        return this.setState(() => {
          return {
            isLoading: false,
            dataSource: responseJSON.data.children
          };
        });
      })
      .catch(reject => {
        return <Alert>No internet connection!</Alert>;
      });
  }

  //Lifecyle method
  componentDidMount() {
    // return fetch('https://facebook.github.io/react-native/movies.json')
    // .then((response)=>response.json())
    // .then((responseJson)=>{
    //   this.setState(()=>{
    //     return {isLoading:false, dataSource : responseJson.movies}
    //   })
    // })
    return this.getData();
  }

  render() {
    if (!this.state.isLoading) {
      // let movies = this.state.dataSource.map((val,key)=>{
      //   return <View key={key} style = {styles.item}>
      //     <Text>{val.title}</Text>
      //   </View>
      // });
      let post = this.state.dataSource;
      console.log(post.length);
      return (
        <View>
          {/* {movies} */}
          <FlatList
            style={{
              margin: 10,
            }}
            data={post}
            renderItem={({ item }) => {
              //Find hardware img based on flair_text
              let img = this.hardwareImage(item.data.link_flair_text);
              return (
                <TouchableOpacity onPress={() => this.handleURL(item.data.url)}>
                  <View style={styles.item}>
                    <Image
                      style={{ width: 48, height: 48, marginEnd: 5 }}
                      source={img}
                    />
                    <Text style={{ flex: 5 }}> {item.data.title} </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item.data.id}
            ItemSeparatorComponent = {()=>{
              return(
              <View
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: "#CED0CE",
                  marginTop:5,
                  marginBottom:5
            }}
            ></View>
            )}}
            onRefresh = {this.getData}
            refreshing = {this.state.isLoading}    
            />      
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text> Loading </Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  text: {
    fontSize: 20,
    marginBottom: 10
  },
  header: {
    fontSize: 30,
    marginBottom: 15
  },
  box: {
    borderWidth: 1,
    borderColor: "gray"
  },
  item: {
    fontSize: 20,
    flexDirection: "row",
    flex: 1,
  }
});
