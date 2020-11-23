const hbs = require("hbs");
const fs = require("fs");
const path = require("path");
const readFile = require("util").promisify(fs.readFile);
const SibApiV3Sdk = require("sib-api-v3-sdk");

let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

async function renderTemplate(file, data) {
  const content = await readFile(path.join(__dirname, file), "utf8");
  const template = hbs.compile(content);
  return template(data);
}

async function sendVerificationEmail(user) {
  const { email, verificationCode } = user;
  const emailVerificationTemplate = await renderTemplate(
    "../views/email/email-verification.html",
    {
      email,
      verificationCode,
    }
  );
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = "SA-INTRANET: OTP for email verification";
  sendSmtpEmail.htmlContent = emailVerificationTemplate;
  sendSmtpEmail.sender = {
    name: "Arun Prabhu",
    email: "arunprabhuk94@gmail.com",
  };
  sendSmtpEmail.to = [{ email, name: email }];
  sendSmtpEmail.replyTo = sendSmtpEmail.sender;

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );
    },
    function (error) {
      console.error(error);
    }
  );

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = {
  sendVerificationEmail,
};
