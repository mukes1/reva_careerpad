const express = require('express');
const router = express.Router();

//endpoint for getting all placement offers
router.get('/placements', (req, res, next)=>{
    res.render('placements', {title: 'Placement Offers'});
});


//endpoint for getting placement offer by id
router.get('/placementById', (req, res, next)=>{
    res.render('singlePlacement', {title: 'Placement Name'});
}); 

router.post('/', (req, res, next)=>{
    console.log(req.body);
    res.send('Successfully posted a placmement offer');
})

module.exports = router;