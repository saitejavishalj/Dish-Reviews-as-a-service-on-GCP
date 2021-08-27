import React from "react";
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Badge,
} from "react-native-paper";
import { StyleSheet, ScrollView } from "react-native";

async function connectToMongo() {
  const uri =
    "mongodb+srv://admin:root@cluster0.jhmx0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const mclient = new MongoClient(uri);
  try {
    // Connect to the MongoDB cluster
    await mclient.connect();
    let predictedOutput = await getReviews(mclient);
    return predictedOutput;
  } catch (e) {
    console.error(e);
  } finally {
    await mclient.close();
  }
}

function RestaurantBestDish({ route, navigation }) {
  const res = route.params;
  let address = res.address;
  let top_by_res = res.top_by_res;
  return (
    <ScrollView style={styles.scrollView}>
      {address.map(function (res, index) {
        let obj;
        {
          top_by_res.map(function (result, index) {
            if (res["business_id"] == result["id"]) {
              obj = result;
            }
          });
        }
        return (
          <Card key={index}>
            <Card.Cover source={require("./assets/res.jpeg")} />
            <Card.Content>
              <Title>{res["business_name"]}</Title>
              <Paragraph>{res["business_city"]}</Paragraph>
              <Paragraph>{res["business_full_address"]}</Paragraph>
              <Paragraph>{res["business_categories"]}</Paragraph>
              {obj["dishes"].map(function (results, index) {
                let key = Object.keys(results);
                return <Button key={index}>{key[0]}</Button>;
              })}
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

export default RestaurantBestDish;
