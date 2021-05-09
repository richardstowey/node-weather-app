const hbs = require("hbs");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Import utils
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

/* Debug Mode */
// When set to true, debug mode will override the speed coming from the forecast
const debugMode = false;
// choose from none, light, medium, heavy, excessive
const debugWindSpeed = "heavy";

/* Data input */
const user = {
  name: "Rich",
  email: "richardstowey@gmail.com",
  location: "South Croydon, Surrey",
  timeZoneOffset: -60,
  daysOfWeek: [0, 6], // 0 = sunday
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

// Random preheaders
const preheaders = [
  "Today's a great day to dust off those wings and go flying!",
  "Looks like the wind is ready for you!",
  "Time to find a field and set up camp!",
  "How many kites can you get up in the sky at once?",
];

const sendgridTemplateIds = {
  lightWind: "d-8a4291fb067e4d06b7208c9d6a804779",
  mediumWind: "d-7695e89bd076467bbc21e7779379d784",
  heavyWind: "d-4578faf062b14bb1b92f769ea76f7a55",
};

const randomSubject =
  emailSubjects[Math.floor(Math.random() * emailSubjects.length)];
const randomPreheader =
  preheaders[Math.floor(Math.random() * preheaders.length)];
console.log(randomSubject);

const today = new Date();
const currentDayOfWeek = today.getDay();
console.log(today.getTimezoneOffset());
console.log(days[currentDayOfWeek]);

if (user.daysOfWeek.includes(currentDayOfWeek)) {
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

      // If debug mode is enabled at the top of the document, choose a setting and then test each different email template. Emails send for light, medium and heavy only.
      if (debugMode) {
        switch (debugWindSpeed) {
          case "none":
            forecastData.windSpeed = 0;
            break;
          case "light":
            forecastData.windSpeed = 29;
            break;
          case "medium":
            forecastData.windSpeed = 44;
            break;
          case "heavy":
            forecastData.windSpeed = 59;
            break;
          case "excessive":
            forecastData.windSpeed = 100;
            break;
        }
      }

      var chosenTemplate = "";
      if (forecastData.windSpeed <= 15) {
        console.log("Not windy enough to fly!");
        return;
      } else if (forecastData.windSpeed <= 30) {
        chosenTemplate = sendgridTemplateIds.lightWind;
        console.log("Chosen email template: Light Wind");
      } else if (forecastData.windSpeed <= 45) {
        chosenTemplate = sendgridTemplateIds.mediumWind;
        console.log("Chosen email template: Medium Wind");
      } else if (forecastData.windSpeed <= 60) {
        chosenTemplate = sendgridTemplateIds.heavyWind;
        console.log("Chosen email template: Heavy Wind");
      } else {
        console.log("Too Windy to fly!");
        // Too windy to fly
        return;
      }

      // TODO: Add in templates and choose one

      console.log("Windy enough to fly");
      console.log(user);
      console.log(forecastData);

      // Construct email message to send out when windy enough
      const msg = {
        to: [{ email: user.email, name: user.name }], // Recipient (array of objects)
        from: {
          email: "notifications@flyawaywith.me",
          name: "Fly Away With Me",
        }, // Verified sender (with Sendgrid)
        reply_to: {
          email: "notifications@flyawaywith.me",
          name: "Fly Away With Me",
        },
        subject: randomSubject,
        templateId: chosenTemplate,
        dynamic_template_data: {
          subject: randomSubject,
          preheader: randomPreheader,
          name: user.name,
          location: user.location,
          windSpeed: forecastData.windSpeed,
        },
      };

      // Send email message
      sgMail
        .send(msg)
        .then((response) => {
          console.log("Status code: " + response[0].statusCode);
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

/*

Test Data

{
"subject": "This is the subject",
"preheader": "This is the preheader",
"name": "Rich",
"location": "South Croydon",
"windSpeed": 17
}

*/
