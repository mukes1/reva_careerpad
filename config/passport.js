const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');
const Admin = require('../model/admin');

//session constructor
function SessionConstructor(userId, userGroup, details) {
  this.userId = userId;
  this.userGroup = userGroup;
  this.details = details;
}


//passport configuration
passport.serializeUser(function (userObject, done) {
  // userObject could be a Model1 or a Model2... or Model3, Model4, etc.
 try{
  let userGroup = "default";
  let userPrototype = Object.getPrototypeOf(userObject);

  if (userPrototype === User.prototype) {
    userGroup = "user";
  } else if (userPrototype === Admin.prototype) {
    userGroup = "admin";
  }

  let sessionConstructor = new SessionConstructor(userObject.id, userGroup, '');
  console.log(sessionConstructor);
  done(null, sessionConstructor);
}catch(err){console.log(err);}
});

passport.deserializeUser(function (sessionConstructor, done) {
  try{
  if (sessionConstructor.userGroup == 'user') {
    User.findOne({
      _id: sessionConstructor.userId
    }, function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
      done(err, user);
    });
  } else if (sessionConstructor.userGroup == 'admin') {
    Admin.findOne({
      _id: sessionConstructor.userId
    }, function (err, admin) { // When using string syntax, prefixing a path with - will flag that path as excluded.
      done(err, admin);
    });
  }
}catch(err){console.log(err)};
});

passport.use('user', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    User.getUserByEmail(email, function (err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, {
          message: 'Unknown User'
        });
      }
      User.validatePassword(password, user.password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: 'Invalid password'
          });
        }
      });
    });
  }
));


passport.use('admin', new LocalStrategy({
    usernameField: 'employeeEmail',
    passwordField: 'employeepPassword'
  },
  function (employeeEmail, employeePassword, done) {
    Admin.getAdminByEmail(employeeEmail, function (err, admin) {
      if (err) throw err;
      if (!admin) {
        return done(null, false, {
          message: 'Unknown User'
        });
      }
      Admin.validatePassword(employeePassword, admin.employeePassword, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, admin);
        } else {
          return done(null, false, {
            message: 'Invalid password'
          });
        }
      });
    });
  }
));