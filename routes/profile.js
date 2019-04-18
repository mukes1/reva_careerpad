const express = require('express');
const router = express.Router();
const passport = require('passport');
const session = require('express-session');
const User = require('../model/user');
const Joi = require('joi');
const moment = require('moment');

//validating profile schema
const profileSchema = Joi.object().keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      SRN: Joi.string().regex(/^[a-zA-Z0-9]{0,8}$/).required(),
      DOB: Joi.date().max('now'),
      Address: Joi.string().max(100).required(),
      Contact: Joi.string().trim().regex(/^[0-9]{7,10}$/).required()
});

//middleware to redirect to login page if not logged in
/*const redirectLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
  res.redirect('/login');
}
*/

//endpoint for profile
router.get('/profile', (req, res, next) => {
  req.flash('success_messages', 'Login Successful');
  res.render('profile', {
    title: 'Profile',
    user: req.user,
    dob: moment(req.user.DOB).format('YYYY-MM-DD')
  });
});


//endpoint for resume upload
router.get('/resume', (req, res, next) => {
  res.render('resume', {
    title: 'Upload Resume',
    user: req.user
  });
});
//endpoint for profile update
router.post('/updateProfile',async (req, res, next) => {
  user = req.user;
  try {
    const result = Joi.validate(req.body, profileSchema)
    console.log(result);
    if(result.error){
      req.flash('error_messages', 'Date entered is not valid. Please try again');
      res.redirect('/profile');
      return;
    }
    
    await User.updateOne({_id: user._id},result.value);

    res.status(200).redirect('/profile', {
      title: 'Profile',
      user: req.user
    });
  } catch (error) {
    next(error);
  }
});


//endpoint to logout
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_messages', 'You are logged out');
  res.redirect('/');
})


module.exports = router;