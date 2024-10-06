const nodemailer = require('nodemailer');
let transporter;
let transporterInitialized = false;
let lastUsedTime;
const sessionTimeout = 30 * 60 * 1000;

const initTransporter = async (email, password) => {
  if (!transporterInitialized || (lastUsedTime && Date.now() - lastUsedTime > sessionTimeout)) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.verify()
      .then(() => {
        transporterInitialized = true;
      })
      .catch((error) => {
        console.error('Error during transporter verification:', error);
      });
  }
};

const sendEmail = async (to, subject, body, email, password) => {
  await initTransporter(email, password);
  lastUsedTime = Date.now();

  const mailOptions = {
    from: email,
    to: to,
    subject: subject,
    html: body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info.response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
