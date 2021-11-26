
const nodemailer = require('nodemailer') 
const {google} = require('googleapis') 

require('dotenv').config();

const CLIENT_ID =  process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET 
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI) 
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN }); 

const accessToken = oAuth2Client.getAccessToken();

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'finsightai@gmail.com',
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
    accessToken: accessToken,
  },
  debug: true,
  // pool: true,
});

async function sendMail(toEmail, subject, text, html) {
  try {
    
    const mailOptions = {
      from: 'Finsight AI <finsightai@gmail.com>',
      to: toEmail,
      subject: subject,
      text: text,
      html: html,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
} 



router.route('/sendEmailInvite').post((req, res) => {
  
  var fromEmail = req.body.fromEmail; 
  var toEmails = req.body.toEmails; // array
  var link = req.body.shareableLink; 
  var subject =   `${fromEmail} shared a note with you` 
  var html = `<br> <a href=${link}>Click to Open</a>` 


  // _.each(toEmails, function(toEmail) {
  //   sendMail(toEmail, subject, text, html)
  //   .then((result) => {
  //     console.log('Email sent...', result);  
  //     res.json('success')
  //   })
  //   .catch((error) => {
  //     console.log(error.message);
  //     res.json('error')
  //   });
  // }) 

});
 


