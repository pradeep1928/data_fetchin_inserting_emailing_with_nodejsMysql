const nodemailer = require("nodemailer");
const moment = require("moment");

var sendDate = new Date();
let send = moment(sendDate).format("YYYY-MM-DD-HH-mm-ss");

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "lawbell135@gmail.com",
    pass: "krrgwvhypndjxbba",
  },
});

const sendTable_to_mail = (emailAddress, mailData) => {
  const mailOptions = {
    from: "lawbell135@gmail.com",
    to: emailAddress,
    subject: `mis_report ${send}`,
    html: mailData,
  };

  transport.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    }
    console.log("this is mail info", info.messageId);
    process.exit(0)
  });
};


module.exports = {
  sendTable_to_mail,
};
 

