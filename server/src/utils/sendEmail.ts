import nodemailer from "nodemailer";
// const transporter = nodemailer.createTransport({
//   host: "smtp.forwardemail.net",
//   port: 465,
//   secure: true,
//   auth: {
//     // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//     user: "REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM",
//     pass: "REPLACE-WITH-YOUR-GENERATED-PASSWORD",
//   },
// });

const createTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();
  console.log("----- test email account: ", testAccount);

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    // host: "smtp.forwardemail.net",
    // port: 465,
    // secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: testAccount.user,
      pass: testAccount.pass,
      // user: "REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM",
      // pass: "REPLACE-WITH-YOUR-GENERATED-PASSWORD",
    },
  });
  return transporter;
};

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, html: string) {
  const transporter = await createTransporter();
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    // to: "bar@example.com, baz@example.com", // list of receivers
    to, // list of receivers
    subject: "Change password", // Subject line
    html, // plain text body
    // html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}
