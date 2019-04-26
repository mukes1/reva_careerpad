const express = require('express');
const router = express.Router();
const passport = require('passport');
const session = require('express-session');
const Placement = require('../model/placements');
/* GET home page. */
router.get('/', async (req, res, next)=> {
  placements = await Placement.find({}).limit(3);
  placement = placements
  res.render('home', {
    title: 'REVA Careerpad'
  });
});




module.exports = router;