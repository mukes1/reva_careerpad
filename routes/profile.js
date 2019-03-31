var express = require('express');
var router = express.Router();

/* GET login page  */
router.get('/', function(req, res, next) {
  res.render('profile', {title: 'Profile'})
});

//endpoint to logout
router.get('/logout', (req, res)=>{
  req.logOut();
  res.redirect('/');
})


module.exports = router;