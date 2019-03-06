const express = require('express');
const router = express.Router();

router.get('/', (req, res, next)=>{
    res.render('register', {title: 'Careerpad Registration'});
});

router.post('/', (req, res, next)=>{
    console.log(req.body);
    res.redirect('/login');
    res.send('Successfully registered');
    
})

module.exports = router;