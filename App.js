import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Modal, Alert, Pressable } from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const API_KEY = "bffb97e77211787831811fc292a08561";
const icons = { 
  Clouds : "cloudy",
  Clear : "day-sunny", 
  Thunderstorm : "lightning",
  Drizzle : "rain",
  Rain : "rains",
  Snow : "snow",
  Atmosphere : "cloudy-gusts",
}

export default function App() {
  const [city, setCity] = useState('Loading...');
  const [days, setDays] = useState([])
  const [ok, setOk] = useState(true);
  const [modalVisible, setModalVisible] = useState(true);
  // Location 허락
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setOk(false);
    } 
    const {coords:{latitude, longitude}}  = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude},{useGoogleMaps:false});
    setCity(location[0].region);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.list);
    
  };
  useEffect(()=>{
    getWeather();
  },[]);

  return <View style={styles.container}>
    
    <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerstyle={styles.weather}>
        {days.length === 0 ? (
        <View style={{...styles.day, alignItems: "center"}}><ActivityIndicator color="white" size="large" style={{marginTop:10}} /></View>
        ) : (
        days.map((day, index) =>
          <View key={index} style={styles.day}>
            <View style={{flexDirection:'row', alignItems:'center', width: '100%', justifyContent:'space-between'}}>
              <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
              <Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
            </View>
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{new Date(day.dt*1000).toDateString()}</Text>
          </View>
          )
        )}
      </ScrollView>

      {ok === true ? null : 
      <View>
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { Alert.alert('Modal has been closed.'); setModalVisible(!modalVisible);}}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>위치사용 동의해주세여</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>닫기</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
      
      }
      
  </View>;
}

const styles = StyleSheet.create({
  container : {
    flex: 1, backgroundColor: "#78e08f"
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 60,
    fontWeight: "500",
    color: 'white',
  }
  ,
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingRight: 20,
  },
  temp : {
    fontSize: 100,
    marginTop: 50,
    color: 'white',
  },
  description : {
    fontSize: 40,
    marginTop: -30,
    color: 'white',
  },
  tinyText : {
    fontSize : 20,
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
})