const User = require('../models/user');

//---- use for sending mail
const forgotPasswordMailer = require('../mailer/forgot_password_mailer');
const welcomeMailer = require('../mailer/welcome_mailer');

//---- use to encryption
const crypto = require('crypto'); 
const request = require('request');
// const { request } = require('http');

//---- seceret key for capche
const secretKey = 'reCAPTCHA_seceret_key';

//---- display user profile
module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: 'Profile',
            user: user
        });
    });
    
}

// render the sign in page
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    };
    res.render('user_sign_in',{
        title: "Sign In"
    });
}

// render the sign up page
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    };

    res.render('user_sign_up',{
        title: "Sign Up"
    });
}

//---- create user and store it in db
module.exports.create = function(req,res){
    console.log(req.body);
    //---- if pass and confirm pass does't match
    if(req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords and Confirm Password does not match');
        return res.redirect('back');
    }
    //---- find if the user already present
    User.findOne({email: req.body.email},function(err,user){
        if(err){
            req.flash('error',err);
            return;
        }
        //---- if user not present create user
        if(!user){
            let newUser = new User();
            newUser.name = req.body.name;
            newUser.email = req.body.email;
            //const password = req.body.password;
            newUser.setPassword(req.body.password);
            
            newUser.save((err, user) => {
                if(err){console.log("error in creating user"); return;}
                return res.redirect('/users/sign-in');
            })
            //console.log("email:",user);
            welcomeMailer.welcome(req.body);
        }
        else{
            // req.flash('success', 'You have signed up, login to continue!');
            req.flash('error', 'Email already in use!!');
            return res.redirect('back');
        }
    })
}

//----Create user session when SignIn
module.exports.createSession=function(req,res){
        //console.log("check",req.body);
        req.flash('success','Logged in successfully');
        return res.redirect('/');
}

//--- destroy session when sign-out
module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','Sign Out successfully');
    return res.redirect('/');
}

//--- reset password
module.exports.reset = async function(req,res){
    
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);

            if(user.validPassword(req.body.current_password)){
                if(req.body.new_password == req.body.confirm_password){
                    //user.password = req.body.new_password;
                    user.setPassword(req.body.new_password);
                    req.flash('success', 'Successfully change pasword');
                }else{
                    req.flash('error', 'Password and Confirm password does not match!! ');
                }
                
            }else{
                req.flash('error', 'Enter valid Current password!');
            }

            user.save();
            return res.redirect('back');
        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    }
}

//--- forgotpass
module.exports.forgotPass = function(req,res){
    res.render('forgoten_password',{
        title: "Forgotten Password"
    });
}

//---- sending mail to reset password
module.exports.resetMail = async function(req,res){
    console.log(req.body.email);
    try{
       User.findOne({email: req.body.email}, function(err,user){
           if(err){
            req.flash('error', err);
            return;
           }
           if(!user){
                req.flash('error','Invalid Email!!');
                return res.redirect('back');
           }
            //console.log(user);
            let new_password = crypto.randomBytes(20).toString('hex');
            user.setPassword(new_password);
            //console.log(new_password);
            forgotPasswordMailer.forgotPassword(user, new_password);
            req.flash('success','Check your Email.');
            user.save();
            return res.redirect('back');
       })
    }catch(err){
        req.flash('error','Invalid Email Id');
    }
   
}

//---- Validate captcha
module.exports.captchaValidate = function(req,res){
    
    if(!req.body.captcha){
        return res.json({"success":false, "msg":"Invalid Capthca"});
    }

    const Url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`;
     
    request(Url, (err, response, body) => {
        //---- if url not match
        if(err){
            console.log(err);
        }

        body = JSON.parse(body);
        console.log("Captcha Status:",body);
        if(!body.success && body.success === undefined){
            return res.json({"success":false, "msg":"captcha verification failed"});
        }
        else if(body.score < 0.5){  // 0.5= By default, threshold
            return res.json({"success":false, "msg":"you might be a bot, sorry!", "score": body.score});
            
        }
        return res.json({"success":true, "msg":"captcha verification passed", "score": body.score});
    })
}