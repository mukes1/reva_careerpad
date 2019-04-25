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

//get placement by id
router.get('/placement/:id', async (req, res)=>{
  try{
      placement = await Placement.findOne({_id: req.params.id});
      res.render('singlePlacement');
}catch(err){console.log(err)};
})


module.exports = router;