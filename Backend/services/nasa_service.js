const axios = require("axios");

const NASA_BASE_URL = "https://api.nasa.gov/neo/rest/v1";

exports.getAsteroidFeed = async () => {
  const response = await axios.get(`${NASA_BASE_URL}/feed`, {
    params: {
      api_key: process.env.NASA_API_KEY,
    },
  });

  return response.data.near_earth_objects;
};
