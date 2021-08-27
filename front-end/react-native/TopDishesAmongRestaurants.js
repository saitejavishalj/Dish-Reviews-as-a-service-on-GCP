import * as React from "react";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import { StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { createClient } from "pexels";

const client = createClient(
  "563492ad6f917000010000019c7273895e5949f1b9fde7d38e348e4c"
);

function TopDishesAmongRestaurants({ route, navigation }) {
  const res = route.params;
  let top_dishes = res.top_dishes;
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="filter"
          style={{ marginRight: 5 }}
          size={30}
          color="black"
          onPress={() => navigation.navigate("RestaurantBestDish", res)}
        />
      ),
    });
  }, [navigation]);
  return (
    <ScrollView style={styles.scrollView}>
      {top_dishes.map(function (dish, index) {
        let key = Object.keys(dish);
        const query = key[0];
        client.photos.search({ query, per_page: 1 }).then((photos) => {
          console.log(photos);
        });
        return (
          <Card key={index}>
            <Card.Cover source={require("./assets/dish.jpeg")} />
            <Card.Content>
              <Title>{key[0]}</Title>
              <Paragraph>
                Score:
                {dish[key[0]]}
              </Paragraph>
            </Card.Content>
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 20,
  },
});

export default TopDishesAmongRestaurants;
