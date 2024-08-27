import { StyleSheet, View, Text, ActivityIndicator, SafeAreaView, ScrollView, RefreshControl } from 'react-native'
import React, {useState, useEffect} from 'react'
import Constants from 'expo-constants'
import WeatherInfo from './WeatherInfo';
import { API_KEY, BASE_URL } from '@env';

const Weather = () => {

  const [weatherData, setWeatherData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeatherData = async (cityName) => {
    try{

      setRefreshing(true);
      setLoaded(false);

      const response = await fetch(`${BASE_URL}?q=${cityName}&appid=${API_KEY}`);

      if(response.status == 200){
        const data = await response.json();
        setWeatherData(data);

      }else{
        setWeatherData(null);
      }
      
      setRefreshing(false);
      setLoaded(true);

    }catch(error){
      Alert.alert('Error', error.message)
    }

  }

  // city name
  useEffect(()=>{
    fetchWeatherData('delta');
  }, []);

  // if data is not loaded, show a loading message
  if(!loaded){
    return (
      <View style={styles.container}>
          <ActivityIndicator size='large' color='red' />
      </View>
    )
  }else if (weatherData === null) {
    return (
      <View style={styles.container}>
        <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={() => fetchWeatherData('delta')}
          />
        }
        style={{marginTop: 50}}
        >
          <View style={styles.header}>
          <Text style={styles.headerTitle}>City not found</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Weather App</Text>
        </View>

        <WeatherInfo weatherData={weatherData} fetchWeatherData={fetchWeatherData} />
    </View>
  )
}

export default Weather

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#23395D',
      paddingTop: Constants.statusBarHeight,
    },
    header: {
      alignItems: 'center',
      backgroundColor: '#FFF',
      height: 80,
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: 'bold'
    }
  });
  