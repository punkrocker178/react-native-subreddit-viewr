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
  Button,
  Alert,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  ToastAndroid
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
      isLoading: true,
      dataSource: null,
      listingBefore: null,
      listingAfter: null,
      count:0
    };
    this.hardwareImage = this.hardwareImage.bind(this);
    this.handleURL = this.handleURL.bind(this);
    this.getData = this.getData.bind(this);
  }

  //Phân loại icon dựa theo itemType trong json
  hardwareImage(itemType) {
    let img;
    if(itemType == null){
      img = images.Other;
    }else{
      switch (itemType[0].toLowerCase()) {
        case "[monitor]":
          img = images.Monitor;
          break;
        case "[cpu]":
          img = images.CPU;
          break;
        case "[gpu]":
          img = images.GPU;
          break;
        case "[psu]":
          img = images.PSU;
          break;
        case "[ram]":
        case "[memory]":
          img = images.RAM;
          break;
        case "[cooler]":
        case "[fan]":
        case "[cooling]":
        case "[case fan]":
          img = images.Cooler;
          break;
        case "[keyboard]":
          img = images.Keyboard;
          break;
        case "[mouse]":
          img = images.Mouse;
          break;
        case "[headphones]":
          img = images.Headphones;
          break;
        case "[ssd]":
          img = images.SSD;
          break;
        case "[motherboard]":
        case "[mobo]":
          img = images.MOBO;
          break;
        case "[controller]":
        case "[console]":
          img = images.Controller;
          break;
        case "[hdd]":
          img = images.HDD;
          break;
        case "[case]":
          img = images.Case;
          break;
        case "[router]":
          img = images.Router;
          break;
        case "[laptop]":
          img =images.Laptop;
        break;
        case "[prebuilt]":
          img = images.Prebuilt;
        break;
        case "[flash]":
        case "[sd card]":
          img = images.SD;
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
    console.log("Fetching "+this.state.count);
    let url = "https://www.reddit.com/r/buildapcsales/.json";
    if(this.state.count>0){
      url = url+"?after="+this.state.listingAfter;
    }
    ToastAndroid.show("Fetching "+this.state.count,ToastAndroid.SHORT);
    fetch(url)
      .then(response => { // Lấy kết quả trả về rồi chuyển thành json
        return response.json();
      })
      .then(responseJSON => { //lưu kết quả json vào this, cập nhật trạng thái isLoading
        return this.setState(() => {
          return {
            isLoading: false,
            dataSource: responseJSON.data.children,
            listingAfter:responseJSON.data.after,
            count: this.state.count+1
          };
        });
      })
      .catch(reject => {
        return(Alert.alert(reject.toString(),"Cant Connect to Reddit"))
      });
  }

  //Lifecyle method
  componentDidMount() {
    return this.getData();
  }

  render() {
    //Xác định trạng thái isLoading để hiển thị dữ liệu
    if (!this.state.isLoading) {//isLoading = false ; fetch thành công

      let post = this.state.dataSource;
      console.log(post.length);
      return (
        <View>
          <FlatList
            style={{
              margin: 10,
            }}
            data={post}
            renderItem={({ item }) => {//Xác định khuôn của phần tử trong danh sách

              //Find hardware img based on itemType
              let itemType = item.data.title.match(/\[[0-9a-zA-Z\s]+\]/);
              if(itemType == null){
                  console.log("Cannot get item type: "+item.data.title);
              }else{
                console.log(itemType[0].toLowerCase());
              }
              let img = this.hardwareImage(itemType);
              let thumbnail;
              if(item.data.thumbnail == "default"){
                thumbnail = images.Thumbnail;
              }else{
                thumbnail = {uri:item.data.thumbnail};
              }
              return (
                <TouchableOpacity onPress={() => this.handleURL(item.data.url)}> 
                  <View style={styles.item}>
                    <Image
                      style={{ width: 40, height: 40, marginEnd: 5 }}
                      source={img}
                    />
                    <Text style={{ flex: 5 }}> {item.data.title} </Text>
                    <Image style ={{flex:1,height:50}}
                      source={thumbnail}></Image>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item.data.id}
            ItemSeparatorComponent = {()=>{ //Component đường chia cắt các item trong danh sách
              return(
              <View
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: "#CED0CE",
                  marginTop:5,
                  marginBottom:5
            }}></View>
            )}}
            onRefresh = {this.getData} //Kéo để refresh
            refreshing = {this.state.isLoading}
           
            />      
        </View>
      );
    } else {// isLoading = true ; đang fetch dữ liệu hoặc không có mạng
      return (
        <View style={styles.container}>
          <Text> Loading </Text>
        </View>
      );
    }
  }
}

//Styling
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
