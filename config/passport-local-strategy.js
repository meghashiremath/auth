const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback:true
    },
    //----done is passport callback function we can also use our own!
    function(req,email, password, done){
       //find the user and establish the identity
        User.findOne({email: email}, function(err, user){
            if(err){
                req.flash('error',err);
                //console.log('Error in finding user ----> Passport');
                return done(err);
            }
            if(!user || !user.validPassword(password)){
                req.flash('error','Invalid Username/Password');
                //console.log('Invalid Username/Password');
                return done(null, false);
            }

            return done(null, user);
        });
    }
));

//--- serializing/derypt user identity i cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});

//--- desearilizing
passport.deserializeUser(function(id, done){
    User.findById(id, function(err,user){
        if(err){
            console.log('Error in findng user');
            return done(err);
        }
        return done(null, user);
    });
});

//----check if the user is authenticated
// @ts-ignore
passport.checkAuthentication = function(req,res,next){
    //---- if the user is signes in, then pass on the request to the next function(controllers action)
    if(req.isAuthenticated()){
        return next();
    }
    //if the user is not signed in
    return res.redirect('/users/sign-in');
}

// @ts-ignore
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user conatins the current signed in user from the session cookies and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;