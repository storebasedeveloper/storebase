const nodemailer = require("nodemailer")
const sendEmail = async(data, req, res)=>{
    let transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 2525,
        secure: false, 
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MAIL_MP,
        }
      });
      let info = await transporter.sendMail({
        from: `"${'storebase'}" <${"babalolagideon22@gmail.com"}>`, 
        to: data.to, 
        subject: data.subject, 
        text: data.text, 
        html : data.html
      });
      

}
module.exports = sendEmail