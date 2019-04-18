const express = require('express');
const router = express.Router();
const passport = require('passport');
const session = require('express-session');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home', {
    title: 'REVA Careerpad'
  });
});



module.exports = router;