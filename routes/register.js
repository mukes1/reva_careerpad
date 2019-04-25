const express = require('express');
const router = express.Router();
const Joi = require('joi');
const passport = require('passport');
const User = require('../model/user');
const Admin = require('../model/admin');

//validate schema
const userSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email({
        minDomainAtoms: 2
    }),
    password: Joi.string().regex(/^[a-zA-Z0-9!@#$%^&*]{6,30}$/).required(),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required()
});

const adminSchema = Joi.object().keys({
    employeeId: Joi.string().required(),
    employeeName: Joi.string().required(),
    employeeEmail: Joi.string().email({
        minDomainAtoms: 2
    }),
    employeePassword: Joi.string().regex(/^[a-zA-Z0-9!@#$%^&*]{6,30}$/).required(),
    confirmPassword: Joi.any().valid(Joi.ref('employeePassword')).required()
});

//render registration page
router.get('/register', (req, res, next) => {
    res.render('register', {
        title: 'Registration'
    });
});

router.post('/register', async (req, res, next) => {

    try {
        const result = Joi.validate(req.body, userSchema)
        console.log(result);
        if (result.error) {
            req.flash('error_messages', 'Data entered is not valid. Please try again.');
            res.redirect('/register');
            return;
        }

        const user = await User.findOne({
            'email': result.value.email
        });
        if (user) {
            req.flash('error_messages', 'Email already in use');
            res.redirect('/register');
            return;
        }

        const hash = await User.hashPassword(result.value.password);

        delete result.value.confirmPassword;
        result.value.password = hash;

        const newUser = await new User(result.value);
        console.log(newUser);
        await newUser.save();

        req.flash('success_messages', 'Registration succesfull, go ahead and login');
        res.redirect('/login');
    } catch (error) {
        next(error);
    }
});

//render admin registration page
router.get('/adminRegister', (req, res, next) => {

    try {
        res.render('admin/poRegister', {
            title: 'Admin Registration'
        });
    } catch (err) {
        console.log(err);
    }
});

router.post('/adminRegister', async (req, res, next) => {

    try {
        const result = Joi.validate(req.body, adminSchema)
        console.log(result);
        if (result.error) {
            req.flash('error_messages', 'Data entered is not valid. Please try again.');
            res.redirect('/register');
            return;
        }

        const admin = await Admin.findOne({
            'employeeId': result.value.employeeId
        });
        if (admin) {
            req.flash('error_messages', 'Id already in use');
            res.redirect('/placementOffice/register');
            return;
        }

        const hash = await Admin.hashPassword(result.value.employeePassword);

        delete result.value.confirmPassword;
        result.value.employeePassword = hash;

        const newAdmin = await new Admin(result.value);
        console.log(newAdmin);
        await newAdmin.save();

        req.flash('success_messages', 'Registration succesfull, go ahead and login');
        res.redirect('/adminLogin');
    } catch (error) {
        next(error);
    }
});

module.exports = router;