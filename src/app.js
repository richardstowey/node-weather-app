// Core modules first (don't need to install them)
const path = require("path");
const express = require("express");
const hbs = require("hbs");

// Import utils
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
// Set the port for Heroku, falling back to 3000 for local dev
const port = process.env.PORT || 1337;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Set up handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Set up static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather app",
    name: "Richard Stowey",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Richard Stowey",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help Page",
    help1:
      "Try turning it off and then turning it on again. That usually does it!",
    name: "Richard Stowey",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Please enter a valid address for weather information.",
    });
  } else {
    geocode(
      req.query.address,
      (error, { latitude, longitude, location } = {}) => {
        if (error) {
          return res.send({ error });
        }
        forecast(latitude, longitude, (error, forecastData) => {
          if (error) {
            return res.send({ error });
          }

          res.send({
            forecast: forecastData,
            location,
            address: req.query.address,
          });
        });
      }
    );
  }
});

app.get("/products", (req, res) => {
  console.log(req.query);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("error", {
    title: "Article not found",
    errorMessage: "Article not found, please try again.",
    name: "Richard Stowey",
  });
});

app.get("*", (req, res) => {
  res.render("error", {
    title: "404",
    errorMessage: "Page not found, please try another page",
    name: "Richard Stowey",
  });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
