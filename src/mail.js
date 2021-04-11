const hbs = require("hbs");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Import utils
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

/* Data input */
const user = {
  name: "Richard Stowey",
  email: "richardstowey@gmail.com",
  location: "South Croydon, Surrey",
  timeZoneOffset: -60,
};

/* Check the day of the week, check the location, if the result is over a certain wind speed then send the email */

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Random subject lines
const emailSubjects = [
  "Get ready to fly!",
  "It's getting windy!",
  "Pack your windbreaker!",
  "Look out, strings about!",
  "Wind-ahoy!",
  "It's whirling up out there!",
];

const randomSubject =
  emailSubjects[Math.floor(Math.random() * emailSubjects.length)];
console.log(randomSubject);

const today = new Date();
const dayOfWeek = today.getDay();
console.log(today.getTimezoneOffset());
console.log(days[dayOfWeek]);

if (dayOfWeek === 0 || dayOfWeek === 6) {
  // Send email

  // Re use the geocode function
  geocode(user.location, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return console.log(error);
    }
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return console.log(error);
      }
      console.log("Checked weather successfully");
      console.log(forecastData);

      if (forecastData.windSpeed <= 15) {
        console.log("Not windy enough to fly!");
        return;
      }

      console.log("Windy enough to fly");

      // Construct email message to send out when windy enough
      const msg = {
        to: [{ email: "richardstowey@gmail.com", name: "Richard Stowey" }], // Recipient (array of objects)
        from: {
          email: "notifications@richardstowey.co.uk",
          name: "Fly Away With Me",
        }, // Verified sender (with Sendgrid)
        reply_to: {
          email: "notifications@richardstowey.co.uk",
          name: "Fly Away With Me",
        },
        subject: randomSubject,
        text:
          "Pack your kite!\rIt's currently ${forecastData.windSpeed} km/h out there in ${user.location}!\rWhat are you waiting for? Get out there!\rhttp://flyawaywith.me",
        html:
          "<h1>Pack your kite!</h1><p>It's currently ${forecastData.windSpeed} km/h out there in ${user.location}!</p><p>What are you waiting for? Get out there!</p><p>Find out more at <a href='http://flyawaywith.me'>Fly Away With Me</a></p>",
      };

      // Send email message
      sgMail
        .send(msg)
        .then((response) => {
          console.log(response[0].statusCode);
          console.log(response[0].headers);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });
} else {
  // don't send an email
}
