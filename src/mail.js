const hbs = require("hbs");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Import utils
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

/* Data input */
const user = {
  name: "Rich",
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
        templateId: "d-8a4291fb067e4d06b7208c9d6a804779",
        dynamic_template_data: {
          subject: randomSubject,
          preheader: randomSubject,
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
