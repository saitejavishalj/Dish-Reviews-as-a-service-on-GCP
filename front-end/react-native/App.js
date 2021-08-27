import React from "react";
import TopDishesAmongRestaurants from "./TopDishesAmongRestaurants";
import HomeScreen from "./HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RestaurantBestDish from "./RestaurantBestDish";

const Stack = createStackNavigator();

export default function App({ navigation }) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TopDishes" component={TopDishesAmongRestaurants} />
        <Stack.Screen
          name="RestaurantBestDish"
          component={RestaurantBestDish}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

async function connectToMongo() {
  const uri =
    "mongodb+srv://admin:root@cluster0.jhmx0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const mclient = new MongoClient(uri);
  try {
    // Connect to the MongoDB cluster
    await mclient.connect();
    return mclient;
  } catch (e) {
    console.error(e);
  } finally {
    await mclient.close();
  }
}
