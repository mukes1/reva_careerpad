const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');

/* GET login page  */
router.get('/', function(req, res, next) {
  res.render('login', {title: 'Login'});
});


passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function(email, password, done) {
    User.getUserByEmail(email, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'Unknown User'});
      }
      User.validatePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
     	if(isMatch){
     	  return done(null, user);
     	} else {
     	  return done(null, false, {message: 'Invalid password'});
     	}
     });
   });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



//validate login
router.post('/', passport.authenticate('local', { successFlash: true, failureRedirect: '/login', failureFlash: true, failureMessage: 'Bad Request'}), (req,res,next)=>{
  res.render('profile', {title: 'Profile', user: req.user});
});

//endpoint to logout
router.get('/logout', (req, res)=>{
  req.logOut();
  req.flash('success_messages', 'You are logged out');
  res.redirect('/');
})

module.exports = router;
