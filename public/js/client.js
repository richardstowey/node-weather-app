console.log("client side javascript is loaded");

// ## Screens ##
const screenSearch = document.getElementById("screen-search");
const screenResults = document.getElementById("screen-results");

// Search Screen
const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const inputLocation = document.getElementById("location-input");
const formLocation = document.getElementById("location-form");
const buttonSubmit = document.getElementById("submit");

// Results Screen
const loading = document.querySelector("#loading");
const temp = document.querySelector("#weather-temp");
const feels = document.querySelector("#weather-feels");
const speed = document.querySelector("#wind-speed");
const description = document.querySelector("#wind-description");
const direction = document.querySelector("#wind-direction");
const returnedLocation = document.querySelector("#returned-location");
const buttonTryAgain = document.getElementById("try-again");

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Hide form
  loading.innerHTML = "Loading...";

  const location = search.value;
  const encodedLocation = encodeURI(location);

  fetch("/weather?address=" + encodedLocation).then((response) => {
    response.json().then((data) => {
      if (data.error) {
        loading.innerHTML = data.error;
      } else {
        screenSearch.style.display = "none";
        screenResults.style.display = "block";

        temp.textContent = data.forecast.temperature;
        feels.textContent = data.forecast.feelsLike;
        speed.textContent = data.forecast.windSpeed;
        description.textContent = windDescription(data.forecast.windSpeed);
        direction.textContent = data.forecast.windDirection;
        returnedLocation.textContent = data.location;

        console.log(data.location);
        console.log(data.forecast);
      }
    });
  });
});

/* Random locations as the placeholder

- Alexandra Palace, London
- Northala Hills, Northolt
- Hampstead Heath, London
- Blackheath, London
- Crystal Palace Park, London
*/

/* Wind speeds - translate into terms like - great!

km/h
0
10 mph / 15 kmh
20 mph / 30 kmh
30 mph / 45 kmh
40 mph / 60 kmh

- 0 - there is no wind
- 1 - 15
*/

function windDescription(windSpeed) {
  if (windSpeed <= 15) {
    return "Not much wind today";
  } else if (windSpeed <= 30) {
    return "Just enough to get off the ground";
  } else if (windSpeed <= 45) {
    return "Plenty of wind for a high flyer";
  } else if (windSpeed <= 60) {
    return "Extremely windy! Take care";
  } else {
    return "It's far too windy today!";
  }
}

buttonTryAgain.addEventListener("click", reset);

function reset() {
  screenResults.style.display = "none";
  screenSearch.style.display = "block";
  loading.innerHTML = "";
  formLocation.reset();
  console.log("Resetting form to try again!");
}
