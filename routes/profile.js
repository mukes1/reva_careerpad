const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const User = require('../model/user');
const Placement = require('../model/placements');
const Joi = require('joi');
const moment = require('moment');
const multer = require('multer');
const pdf = require('html-pdf');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/profilePictures/');
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

//validating profile schema
const profileSchema = Joi.object().keys({
  firstName: Joi.string(),
  lastName: Joi.string(),
  SRN: Joi.string().regex(/^[a-zA-Z0-9]{0,8}$/).required(),
  DOB: Joi.date().max('now'),
  Address: Joi.string().max(100).required(),
  Contact: Joi.string().trim().regex(/^[0-9+ ]{7,15}$/).required(),
  Avatar: Joi.string()
});

//validating resume schema
const resumeSchema = Joi.object().keys({
  Degree: Joi.string(),
  DegreeYear: Joi.number(),
  College: Joi.string(),
  Skills: Joi.array().items(Joi.string(), Joi.number()),
  JobTitle: Joi.string(),
  ExperienceYear: Joi.number(),
  Company: Joi.string(),
  ProjectTitle: Joi.string(),
  ProjectDetails: Joi.string(),
  Interests: Joi.array().items(Joi.string(), Joi.number())
});

const sUpload = upload.single('Avatar');

//middleware to redirect to login page if not logged in
/*const redirectLogin = (req, res, next) => {
  if (req.user !== undefined) {
    next();
  } else {
    res.redirect('/login');
  }
}*/

//endpoint for profile

router.get('/profile', (req, res, next) => {
  res.render('profile', {
    title: 'Profile',
    user: req.user,
    dob: moment(req.user.DOB).format('YYYY-MM-DD')
  });

});



//endpoint for resume upload
router.get('/resume', (req, res, next) => {
  try {
    res.render('resume', {
      title: 'Upload Resume',
      user: req.user
    });
  } catch (err) {
    console.log(err);
  }
});

//endpoint for profile update
router.post('/updateProfile', sUpload, async (req, res, next) => {
  user = req.user;
  try {
    const result = Joi.validate(req.body, profileSchema);
    console.log(result.value);
    console.log(result.error);
    result.value.Avatar = req.file.path;
    if (result.error) {
      req.flash('error_messages', 'Date entered is not valid. Please try again');
      res.redirect('/profile');
      return;
    } else {
      await User.updateOne({
        _id: user._id
      }, result.value);

      req.flash('success_messages', 'Successfully updated profile!');
      res.redirect(200, 'back');
    }
  } catch (error) {
    req.flash('error_messages', 'Couldnot Update Profile!');
    next(error);
  }
});

//endpoint for updating resume schema
router.post('/updateResume', async (req, res, next) => {
  const user = req.user;
  try {
    const result = Joi.validate(req.body, resumeSchema);
    console.log(result.value);
    console.log(result.error);
    if (result.error) {
      req.flash('error_messages', 'Date entered is not valid. Please try again');
      res.redirect('/resume');
      return;
    } else {
      await User.updateOne({
        _id: user._id
      }, {
        Resume: [result.value]
      });

      req.flash('success_messages', 'Successfully updated profile!');
      res.redirect(200, 'back');
    }
  } catch (err) {
    console.log(err);
  }
});

//endpoint fro pdf download
router.post('/downloadResume', (req, res) => {
  /* try{
  const user = req.user;
  const doc = new PDFDocument()
  let filename = user.firstName;
  // Stripping special characters
  filename = encodeURIComponent(filename) + '.pdf'
  // Setting response to 'attachment' (download).
  // If you use 'inline' here it will automatically open the PDF
  res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
  res.setHeader('Content-type', 'application/pdf')
  const content = path.join(__dirname, '../public', 'pdfResume.html');
  console.log(content); 
  doc.y = 300
  doc.font('Times-Roman').text(content, 50, 50);
  doc.pipe(res);
  doc.end();
}catch(err){
  console.log(err);
}*/
  try {
    let options = {
      format: 'A4'
    };
    res.render('pdfResume', {
      user: req.user
    }, function (err, HTML) {
      pdf.create(HTML, options).toFile('./downloads/resume.pdf', function (err, result) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.sendFile(path.join(__dirname, '../downloads', 'resume.pdf'));
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
});

//endpoint for history of applied placements
router.get('/history', async(req, res)=>{
    user = req.user;
    placement = await Placement.find({
      "_id": {
          $in: user.appliedPlacements
      }
  });
  console.log(placement);
    res.render('history', {title: "History of Applied Placements", placement : placement});
});


//endpoint to logout
router.get('/logout', (req, res) => {
  if (req.user && req.cookies.sid) {
    req.logOut();
    res.clearCookie('sid');
    req.flash('success_messages', 'You are logged out');
    res.redirect('/');
} else {
    res.redirect('/login');
}
});


module.exports = router;