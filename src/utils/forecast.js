// Import node modules
const request = require("request");

// Import utils
const windDirection = require("./wind-direction");

const forecast = (latitude, longitude, callback) => {
  const url =
    "http://api.weatherstack.com/current?access_key=4b3b57042d4381870c3bc642aa734d5b&query=" +
    longitude +
    "," +
    latitude +
    "&units=m";

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to mapping service!", undefined);
    } else if (body.error) {
      callback("Unable to find weather. Try another search.", undefined);
    } else {
      callback(
        undefined,
        "The weather is currently " +
          body.current.weather_descriptions[0] +
          ". " +
          "The temperature is " +
          body.current.temperature +
          ", but it feels like " +
          body.current.feelslike +
          ". The wind speed is " +
          body.current.wind_speed +
          ". The wind is travelling " +
          windDirection(body.current.wind_degree) +
          "."
      );
    }
  });
};

module.exports = forecast;

/* Return:

Weather Description
Temperature - is it a warm day?
Wind Speed - is it windy enough?
Wind Direction - which way is it going?

*/
