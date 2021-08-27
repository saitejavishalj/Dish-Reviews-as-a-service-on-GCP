import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Button,
} from "react-native";
import * as Location from "expo-location";

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isAnimating, setisAnimating] = useState(false);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = "Reading your Latitude and Longitude..";
  let text1 = "";
  let text2 = "";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = "";
    text1 = JSON.stringify(location.coords.latitude);
    text2 = JSON.stringify(location.coords.longitude);
  }

  async function buttonPressed() {
    setisAnimating(true);
    try {
      let response = await fetch(
        `https://sixth-syntax-309905.uc.r.appspot.com/sendLatLong?lat=${location.coords.latitude}&long=${location.coords.longitude}`
      );
      let json = await response.text();
      console.log(json);
      let newJson = json.replace(/\'/g, '"');
      console.log(newJson);
      setisAnimating(false);
      navigation.navigate("TopDishes", JSON.parse(newJson));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <React.Fragment>
      {!isAnimating && (
        <View style={styles.container}>
          <Text style={styles.paragraph}>{text}</Text>
          {location && <Text style={styles.paragraph}>Latitude: {text1}</Text>}
          {location && <Text style={styles.paragraph}>Longitude: {text2}</Text>}
          <Button title="Click to Proceed" onPress={buttonPressed} />
        </View>
      )}
      <View style={styles.animate}>
        <ActivityIndicator
          animating={isAnimating}
          size="large"
          color="#00ff00"
        />
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
  animate: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
