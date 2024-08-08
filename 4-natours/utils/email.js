//====================================Here this is the file to Handles the email============================================

const nodemailer= require('nodemailer');

const sendEmail=async options=>{                                                          //here in the options we passes the details like email add., subject line , email content etc. 
          
     //1). Create a Transporter                                                     //here transporter is basically a service that will actually sends email Ex. like we have Gmails 
          const transporter=nodemailer.createTransport({
            host:process.env.EMAIL_HOST,                                            //here if you see in the env file we have added the host and port bcse nodeMailer don't support mailtrap directly that's why we have to do that 
            port:process.env.EMAIL_PORT,
            auth:{
                user:process.env.EMAIL_USERNAME,
                pass:process.env.EMAIL_PASSWORD
            }                        
          })


     //2). Define the email options
          const mailOptions={
            from:'Tirth Joshi <tirth@gmail.com>',
            to:options.email,                                                          //here the user email will come as options as we do't know the user 
            subject:options.subject,
            text:options.message,
            // html:
          }



     //3). Actually  Send the email

    await transporter.sendMail(mailOptions)

};
module.exports=sendEmail;