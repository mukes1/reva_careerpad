const express = require('express');
const router = express.Router();
const Joi = require('joi');
const passport = require('passport');
const User = require('../model/user');

//validate schema
const userSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email({ minDomainAtoms: 2 }),
    password: Joi.string().regex(/^[a-zA-Z0-9!@#$%^&*]{6,30}$/).required(),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required()
});

//render registration page
router.get('/', (req, res, next)=>{
    res.render('register', {title: 'Registration'});
});

router.post('/',async (req, res, next)=>{
    
    try{
        const result = Joi.validate(req.body, userSchema)
        console.log(result);
        if (result.error){
            req.flash('error_messages', 'Data entered is not valid. Please try again.');
            res.redirect('/register');
            return;
        }

        const user = await User.findOne({ 'email': result.value.email });
        if(user){
            req.flash('error_messages', 'Email already in use');
            res.redirect('/register');
            return;
        }

        const hash = await User.hashPassword(result.value.password);

        delete result.value.confirmPassword;
        result.value.password = hash;

        const newUser = await new User(result.value);
        await newUser.save();
        
        req.flash('success_messages', 'Registration succesfull, go ahead and login');
        res.redirect('/login');
    }catch(error){
        next(error);
    }
});

//post the data from 

module.exports = router;