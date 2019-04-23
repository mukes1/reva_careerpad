const express = require('express');
const router = express.Router();


//endpoint for placementOffice route
router.get('/placementOffice/login', (req, res, next)=>{
    try{res.render('admin/poLogin', {title: 'Placement Office'});}catch(err){console.log(err)};
});


module.exports = router;

