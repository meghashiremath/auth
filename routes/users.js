const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller'); 

//--- route when user go to its profile to change pass
router.get('/profile/:id', passport.checkAuthentication, usersController.profile);

//--- route when user reset its password
router.post('/reset/:id', passport.checkAuthentication, usersController.reset);

//---- sign up/in/out request
router.get('/sign-in', usersController.signIn);
router.get('/sign-up', usersController.signUp);
router.get('/sign-out', usersController.destroySession);

//--- create user(sign-up)
router.post('/create', usersController.create);

//--- sign user first passport auth. it and make cookies
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);

//--- google login
router.get('/auth/google',passport.authenticate('google', {scope: ['profile','email']}));

//--- data receive from google
router.get('/auth/google/callback',passport.authenticate(
    'google',
    {failureRedirect: '/users/sign-in'}
    ),usersController.createSession
);

//--- forget password
router.get('/forgot-password', usersController.forgotPass);

//--- route to sending make to reset pass 
router.post('/resetMail', usersController.resetMail);

//---- validate capche
router.post("/captchaValidate", usersController.captchaValidate);


module.exports = router;