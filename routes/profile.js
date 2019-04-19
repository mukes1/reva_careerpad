const express = require('express');
const router = express.Router();
const passport = require('passport');
const session = require('express-session');
const User = require('../model/user');
const Joi = require('joi');
const moment = require('moment');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/profilePictures/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3
  }
});

//validating profile schema
const profileSchema = Joi.object().keys({
  firstName: Joi.string(),
  lastName: Joi.string(),
  SRN: Joi.string().regex(/^[a-zA-Z0-9]{0,8}$/).required(),
  DOB: Joi.date().max('now'),
  Address: Joi.string().max(100).required(),
  Contact: Joi.string().trim().regex(/^[0-9]{7,10}$/).required(),
  Avatar: Joi.string()
});

const sUpload = upload.single('Avatar');

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
router.post('/updateProfile', sUpload, async (req, res, next) => {
  user = req.user;
  try {

    const result = Joi.validate(req.body, profileSchema);
    result.value.Avatar = req.file.path;
    if (result.error) {
      req.flash('error_messages', 'Date entered is not valid. Please try again');
      res.redirect('/profile');
      return;
    }else{
   await User.updateOne({
      _id: user._id
    }, result.value);

    req.flash('success_messages','Successfully updated profile!');
    res.redirect(200,'back');
  }
  } catch (error) {
    req.flash('error_messages','Couldnot Update Profile!');
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