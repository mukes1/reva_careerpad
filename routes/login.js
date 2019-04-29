const express = require('express');
const router = express.Router();
const User = require('../model/user');
const passport = require('passport');
const session = require('express-session');
const Placement = require('../model/placements');
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


//endpoint for admin dashboard fetch
router.post('/adminLogin', async (req, res, next) => {
  if (req.body.employeeEmail === "admin@revacareerpad.com" && req.body.employeePassword === "admin") {
    req.flash('success_messages', 'Welcome Admin!');
    totalPlacements = await Placement.find({}).count().sort({
      placementDeadline: 1
    });
    totalUsers = await User.find({}).count();
    totalCompanies = await Placement.find({}).distinct('placementCompany').count();
    res.render('admin', {
      title: 'CareerPad Admin',
      admin: req.admin
    });
  }else{
    req.flash('error_messages','Login Credentials Wrong');
    res.redirect('back');
  }
});


module.exports = router;