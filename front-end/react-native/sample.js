"use strict";

const yelp = require("yelp-fusion");

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const apiKey =
  "0RdOkkjzxbukiMVs0sWqd2Cdzi3FM-_vREfMw9X8HVyFQ2a_g4pDrY5UeOxQMfyqXVrLTJnSEquTdUAU0hlDJvmoq0sCYNMU5C_eOGjR4JpzIj3uhhRQz0Jp-tNjYHYx";

const searchRequest = {
  radius: 10000,
  location: "Tempe",
  sort_by: "review_count",
};

const client = yelp.client(apiKey);

// client
//   .search(searchRequest)
//   .then((response) => {
//     const firstResult = response.jsonBody.businesses[0];
//     const prettyJson = JSON.stringify(firstResult, null, 4);
//     console.log(prettyJson);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

client
  .business("JzOp695tclcNCNMuBl7oxA")
  .then((response) => {
    console.log(response.jsonBody);
  })
  .catch((e) => {
    console.log(e);
  });
