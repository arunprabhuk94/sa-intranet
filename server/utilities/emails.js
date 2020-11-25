const hbs = require("hbs");
const fs = require("fs");
const path = require("path");
const readFile = require("util").promisify(fs.readFile);
const SibApiV3Sdk = require("sib-api-v3-sdk");
const { capitalize } = require("./helper");
var url = require("url");

let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

function renderTemplate(templateString, data) {
  const template = hbs.compile(templateString);
  return template(data);
}

async function getTemplateString(file) {
  return await readFile(path.join(__dirname, file), "utf8");
}

function sendEmail(sendSmtpEmail, callback) {
  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log("Email Sent. Returned data: " + JSON.stringify(data));
      if (callback) callback();
    },
    function (error) {
      console.error(error);
    }
  );
}

async function sendVerificationEmail(user) {
  const { email, verificationCode } = user;
  const emailVerificationTemplate = await getTemplateString(
    "../views/email/email-verification.html"
  );
  const emailVerificationContent = renderTemplate(emailVerificationTemplate, {
    email,
    verificationCode,
  });

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = "SA-INTRANET: OTP for email verification";
  sendSmtpEmail.htmlContent = emailVerificationContent;
  sendSmtpEmail.sender = {
    name: "Arun Prabhu",
    email: "arunprabhuk94@gmail.com",
  };
  sendSmtpEmail.to = [{ email, name: email }];
  sendSmtpEmail.replyTo = sendSmtpEmail.sender;

  sendEmail(sendSmtpEmail);
}

async function sendAnnouncementEmail(announcement, reqUrl) {
  const { subject, date, category, owner } = announcement;
  const { email: senderEmail, name: senderName } = owner;
  const dateString = date ? new Date(date).toUTCString() : "";
  const announcementTemplate = await getTemplateString(
    "../views/email/announcement-alert.html"
  );
  const sender = {
    name: "Arun Prabhu",
    email: "arunprabhuk94@gmail.com",
  };
  var q = url.parse(reqUrl, true);
  const announcementLink = `${q.host}/app/announcement/${announcement.id}`;
  announcement.users.forEach((user) => {
    const { name, mailSent } = user;
    if (mailSent) return;

    const announcementContent = renderTemplate(announcementTemplate, {
      name,
      subject,
      category,
      dateString,
      senderName,
      senderEmail,
      announcementLink,
    });
    const categoryString = capitalize(category);

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = `${categoryString} from ${senderEmail}: ${subject}`;
    sendSmtpEmail.htmlContent = announcementContent;
    sendSmtpEmail.sender = sender;
    sendSmtpEmail.replyTo = sender;
    sendSmtpEmail.to = [{ email: name, name }];

    sendEmail(sendSmtpEmail, () => {
      user.mailSent = true;
    });
  });
}

module.exports = {
  sendVerificationEmail,
  sendAnnouncementEmail,
};
