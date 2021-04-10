const hbs = require("hbs");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
  subject: "Get your kite ready!",
  text:
    "Pack your kite!\rLooks like it's windy enough to go out and fly!\rWhat are you waiting for? Get out there!",
  html:
    "<h1>Pack your kite!</h1><p>Looks like it's windy enough to go out and fly!</p><p>What are you waiting for? Get out there!</p>",
};

sgMail
  .send(msg)
  .then((response) => {
    console.log(response[0].statusCode);
    console.log(response[0].headers);
  })
  .catch((error) => {
    console.error(error);
  });
