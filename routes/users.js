const express= require('express');
const passport = require('passport');
const Router = express.Router();
const User = require('../models/user');
const userController = require('../controllers/user');
const user = require('../models/user');

Router.get('/register', userController.renderRegister)

Router.post('/register', userController.registerUser)

Router.get('/login', (req, res)=>{
    res.render('users/login');
})

Router.post('/login',passport.authenticate('local', {failureFlash: "Invalid username or password", failureRedirect:'/login'}), userController.login)

Router.get('/logout', userController.logout)

module.exports = Router;