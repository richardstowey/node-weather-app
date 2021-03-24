console.log("client side javascript is loaded");

// Screens
const search = document.getElementById("screen-search");
const loading = document.getElementById("screen-loading");
const results = document.getElementById("screen-results");

// Search Screen
const weatherForm = document.querySelector("form");
const search = document.querySelector("input");

// Results Screen
const temp = document.querySelector("#weather-temp");
const feels = document.querySelector("#weather-feels");
const speed = document.querySelector("#weather-speed");
const direction = document.querySelector("#weather-direction");
const returnedLocation = document.querySelector("#returned-location");

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const location = search.value;
  const encodedLocation = encodeURI(location);

  fetch("/weather?address=" + encodedLocation).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        temp.textContent = data.error;
      } else {
        temp.textContent = data.forecast.temperature;
        feels.textContent = data.forecast.feelsLike;
        speed.textContent = data.forecast.windSpeed;
        direction.textContent = data.forecast.windDirection;
        returnedLocation.textContent = data.location;

        console.log(data.location);
        console.log(data.forecast);
      }
    });
  });
});
