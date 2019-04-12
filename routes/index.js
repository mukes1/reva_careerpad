const express = require('express');
const router = express.Router();
const passport = require('passport');
const session = require('express-session');


//middleware to redirect to login page if not logged in
const redirectLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }
  res.redirect('/login');
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home', {
    title: 'REVA Careerpad'
  });
});


//endpoint for profile
router.get('/profile', redirectLogin, (req, res, next) => {
  res.render('profile', {
    title: 'Profile',
    user: req.user
  })
})

//endpoint to logout
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_messages', 'You are logged out');
  res.redirect('/');
})

module.exports = router;