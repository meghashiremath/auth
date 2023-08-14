const express = require('express');
const port = 8000;
const cookieParser = require('cookie-parser'); //---- to use cookies from web page
const app = express();
const expressLayout = require('express-ejs-layouts'); //---- to use layout
const db = require('./config/mongoose'); //---- use database


// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore= require('connect-mongo')(session); //---- to store user session in db
const flash = require('connect-flash');
const customeMware = require('./config/middleware');

//capche
const bodyParser = require('body-parser');
const request = require('request');

//---- access data from URL and Cookies 
    app.use(express.urlencoded({extended:false}));
    app.use(cookieParser());


//access all the static file
    app.use(express.static('./assets'));
  
// for captcha
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());
    
//use express layout (we have to do this first coz before going to route first it will know about layout)
    app.use(expressLayout);

//extract style and script from sub pages into layout.ejs
    app.set('layout extractStyles',true);
    app.set('layout extractScripts',true);


//----using ejs Template
    app.set('view engine','ejs');
    app.set('views','./views');


//---- making session and use mongoStore to store the session cookies in the db 
    app.use(session({
        name:'auth',
        secret: 'blahSomething',
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: (1000 * 60 * 100)
        },
        store: new MongoStore(
            {
                mongooseConnection: db,
                autoRemove: 'disabled'
            },
            // @ts-ignore
            function(err){
                console.log(err || 'connect-mongodb setup ok');
            }
        )
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(passport.setAuthenticatedUser); //---- use to check the auth. of the user it is define in possport-local-strategy

//---- show flash msg
    app.use(flash());
    app.use(customeMware.setFlash);

//---- use express router
    app.use('/',require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log('Error in running the server:',err);
        return;
    }
    console.log('Server is up and runinng at port: ',port );
})