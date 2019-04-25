const express = require('express');
const router = express.Router();
const User = require('../model/user');
const passport = require('passport');
const session = require('express-session');
require('../config/passport');

//middleware to redirect to user profile if logged in
const redirectProfile = (req, res, next) => {
  if (req.user == undefined) {
    next();
  } else {
    res.redirect('/profile');
  }
}


/* GET login page  */
router.get('/login', redirectProfile, function (req, res, next) {
  res.render('login', {
    title: 'Login'
  });
});


//validate login

router.post('/login', passport.authenticate('user', {
  successFlash: true,
  failureRedirect: '/login',
  failureFlash: true,
  failureMessage: 'User Login Credentials Problem'
}), (req, res, next) => {
  req.flash('success_messages', 'Login Successful');
  req.session.save(() => {
    res.redirect('/profile');
  });
})

//endpoint for placementOffice route
router.get('/adminLogin', (req, res, next) => {
  try {
    res.render('admin/poLogin', {
      title: 'Placement Office Login'
    });
  } catch (err) {
    console.log(err)
  };
});

//endpoint for placementOffice login validation route
/*router.post('/adminLogin', passport.authenticate('admin', {
  successFlash: true,
  failureRedirect: '/adminLogin',
  failureFlash: true,
  failureMessage: 'Admin Login Credentials Problem'
}), (req, res, next) => {
  req.flash('success_messages', 'Login Successful');
  req.session.save(() => {
    res.redirect('/adminDash');
  });
});
*/

router.post('/adminLogin', (req, res, next)=>{
  res.redirect('/adminDash');
});

module.exports = router;