const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('router loaded');

//--- redire all request for / to homeController
router.get('/', homeController.home);

//--- redirect all req for user to user
router.use('/users', require('./users'));

module.exports = router;