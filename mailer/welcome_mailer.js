const nodeMailer = require('../config/nodemailer');

exports.welcome = ( user ) => {
    console.log("ar mailer", user);
    let htmlString= nodeMailer.renderTemplate({user: user}, '/welcome/welcome_user.ejs');
    nodeMailer.transporter.sendMail({
        from: 'developer.zone.20@gmail.com',
        to: user.email,
        subject: 'Welcome',
        html: htmlString
    }, (err,info) => {
        if(err){
            console.log('Error in sending mail',err);
            return;
        }

        console.log('Message send',info);
        return;
    });
}