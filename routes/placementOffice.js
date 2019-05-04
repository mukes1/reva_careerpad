const express = require('express');
const router = express.Router();
const User = require('../model/user');
const Admin = require('../model/admin');
const Placement = require('../model/placements');
const passport = require('passport');
const session = require('express-session');
const Joi = require('joi');
const moment = require('moment');
const path = require('path');
require('../config/passport');
const multer = require('multer');
const Nexmo = require('../config/nexmo');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/placementPictures/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 3
    }
});

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'javascriptnepal@gmail.com',
        pass: 'j$nep@l766'
    }
});



const placementSchema = Joi.object().keys({
    placementTitle: Joi.string().required(),
    placementCompany: Joi.string().required(),
    placementDetails: Joi.string().required(),
    placementEligibility: Joi.array().items(Joi.string(), Joi.number()),
    placementDeadline: Joi.date().required(),
    placementPicture: Joi.string().optional().empty('')
});

const sUpload = upload.single('placementPicture');



//endpoint for placement post
router.get('/addPlacement', (req, res, next) => {
    res.render('admin/placementForm', {
        title: 'Add Placement'
    });
})

//endpoint for placement form submit
router.post('/addPlacement', sUpload, async (req, res, next) => {
    try {
        console.log(req.body);
        const result = Joi.validate(req.body, placementSchema);
        console.log(result);
        console.log(req.file);
        result.value.placementPicture = req.file.path;

        if (result.error) {
            req.flash('error_messages', 'Data entered is not valid. Please try again.');
            res.redirect('/addPlacement');
            return;
        }
        const newPlacement = await new Placement(result.value);
        await newPlacement.save();
        req.flash('success_messages', 'Placement Posted, go ahead and see');
        users = await User.find({});
        let phoneNumbers = [];
        for (i = 0; i < users.length; i++) {
            await phoneNumbers.push(users[i].Contact);
        }
        message = "New Placement!!<br> " + newPlacement.placementTitle + "!!<br> " + newPlacement.placementCompany + "Apply Here http://reva-careerpad.herokuapp.com/placement/" + newPlacement._id;
        await Nexmo.sendBulkSms("REVA CareerPad", message, phoneNumbers);

        let emails = [];
        for (i = 0; i < users.length; i++) {
            await emails.push(users[i].email);
        }

        let mailOptions = {
            from: 'javascriptnepal@gmail.com',
            to: emails,
            subject: 'New Placement Added', // Subject line
            html: '<p>' + message + '</p>' // plain text body
        };

        
        emails.forEach( async function (to, i , array) {
            mailOptions.to = to;
          
             await transporter.sendMail(mailOptions, function (err) {
              if (err) { 
                console.log('Sending to ' + to + ' failed: ' + err);
                return;
              } else { 
                console.log('Sent to ' + to);
              }
          
              if (i === emails.length - 1) { msg.transport.close(); }
            });
          });

        res.redirect('/viewPlacement');
    } catch (err) {
        console.log(err)
    }
});

//endpoint to get view all placement in admin
router.get('/viewPlacement', async (req, res, next) => {
    try {
        placements = await Placement.getAllPlacements();
        placement = placements.docs;
        res.render('admin/allPlacements');
    } catch (err) {
        console.log(err)
    };
});

router.get('/viewPlacement/:id', async (req, res) => {
    try {

        placement = await Placement.findOne({
            _id: req.params.id
        });
        registeredUsers = placement.registeredUsers;
        console.log(registeredUsers);
        if (registeredUsers.length > 0) {
            for (i = 0; i < registeredUsers.length; i++) {
                regUsersId = registeredUsers[i].userId;

            }
            users = await User.find({
                "_id": {
                    $in: [regUsersId]
                }
            });
        } else {
            users = [];
        }
        res.render('admin/singlePlacement');
    } catch (err) {
        console.log(err)
    };
})


//endpoint to get all users of careerpad
router.get('/viewAllUsers', async (req, res, next) => {
    try {
        users = await User.find({});
        res.render('admin/viewAllUsers');
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;