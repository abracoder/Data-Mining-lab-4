require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');

let transport = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 465,
   secure: true,
   auth: {
     user: process.env.EMAIL_ID,
     pass: process.env.EMAIL_PASSWORD
   }
});

function sendMailWithAttachments(email, res){
  // find all files starting with result or log.
  return new Promise((resolve, reject) => {
    const reciever = email;
    const files = findAttachments(email);
    const mailOptions = {
      from: 'abrakilvis@gmail.com', // Sender address
      to: reciever, // recipient's address
      subject: 'Node Mailer', // Subject line
      text: 'logs and results csv files',
      attachments: files
    };

    transport.sendMail(mailOptions, (err, info) => {
      if(err){
        reject(err);
      }else{
        resolve(info);
      }
    })
  })
}

function findAttachments(email){
  let files = fs.readdirSync(email);
  files = files.filter(allFilePaths => allFilePaths.match(/result.*|log.*/) !== null)

  files = files.map((file) => {
    return { filename: file, path: `${email}/${file}` }
  })
  return files;
}

module.exports = sendMailWithAttachments;
