const request = require("request");

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
          "."
      );
    }
  });
};

module.exports = forecast;
