const nodemailer= require('nodemailer');
const ejs= require('ejs');
const path= require('path');

let transporter= nodemailer.createTransport({
    service: 'gmail',
    host: 'sntp.gmail.com',
    port: '587',
    secure: false,
    auth: {
        user: 'admin mail id',
        pass: 'admin password'
    }
});

let renderTemplate= (data,relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){console.log('error in rendering template'); return;}
            
            mailHTML=template;
        }
    )
    return mailHTML;
}



module.exports={
    transporter: transporter,
    renderTemplate: renderTemplate
}