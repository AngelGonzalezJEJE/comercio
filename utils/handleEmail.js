const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  // Retrieve the access token and handle any potential errors
  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        console.error("Error fetching access token:", err.message); // Log detailed error
        return reject("Failed to create access token."); // Reject with a clear message
      }
      resolve(token);
    });
  });

  // Configure the transporter using the OAuth2 credentials
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });

  return transporter;
};

const sendEmail = async (emailOptions) => {
  try {
    console.log(emailOptions)
    const emailTransporter = await createTransporter();
    await emailTransporter.sendMail(emailOptions);
    console.log("Email sent successfully");
  } catch (e) {

    console.error("Error in sendEmail:", e.message, e); // Log detailed error message
  }
};

module.exports = { sendEmail };
