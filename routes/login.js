const express = require('express');
const router = express.Router();
const User = require('../model/user');
const passport = require('passport');
const session = require('express-session');
require('../config/passport');

//middleware to redirect to user profile if logged in
/*const redirectProfile = (req, res, next)=>{
  if(req.isUnauthenticated()){
    next();
  }
  res.redirect('/profile');
}
*/

/* GET login page  */
router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});


//validate login
router.post('/login', passport.authenticate('local', { successFlash: true, failureRedirect: '/login', failureFlash: true, failureMessage: 'Login Credentials Problem'}), (req,res,next)=>{
  req.flash('success_messages','Login Successful');
  req.session.save(()=>{
    res.redirect('/profile');
  });
});


module.exports = router;
