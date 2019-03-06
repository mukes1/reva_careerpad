var express = require('express');
var router = express.Router();

/* GET login page  */
router.get('/', function(req, res, next) {
  res.render('login', {title: 'Careerpad Login'})
});

/*POST login data */
router.post('/',(req, res, next)=>{
  console.log(req.body);
  res.send('Login successful');
});


module.exports = router;
