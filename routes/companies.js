const express = require('express');
const router = express.Router();

router.get('/', (req, res, next)=>{
    res.render('companies', {title: 'Careerpad Companies'});
});

router.post('/', (req, res, next)=>{
    console.log(req.body);
    res.send('Successfully posted a placmement offer');
})

module.exports = router;