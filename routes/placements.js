const express = require('express');
const router = express.Router();
const Placement = require('../model/placements');
const User = require('../model/user');

//endpoint for getting all placement offers
router.get('/placements', async (req, res, next) => {
    user = req.user;
    placements = await Placement.getAllPlacements();
    placement = placements.docs;
    res.render('placements', {
        title: 'Placement Offers'
    });
});


//endpoint for getting placement offer by id
//get placement by id
router.get('/placement/:id', async (req, res) => {
    try {
        user = req.user;
        placement = await Placement.findOne({
            _id: req.params.id
        });
        res.render('singlePlacement');
    } catch (err) {
        console.log(err)
    };
});


//endpoint for applying placement
router.get('/applyPlacement/:id', async (req, res) => {
    try {

        if (req.user === undefined) {
            req.flash('error_messages', 'You are not logged in!!');
            res.redirect('/login');
        } else {
            loggedUser = req.user;
            alreadyApplied = await User.findOne({
                "appliedPlacements": {
                    $in: [placement._id]
                }
            }).count();
            console.log(alreadyApplied);
            if (alreadyApplied > 0) {
                req.flash('error_messages', 'You have already for placement ' + placement.placementTitle);
                res.redirect('back');
            } else {
                await Placement.updateOne({
                    _id: req.params.id
                }, {
                    $push: {
                        registeredUsers: {"userId" :loggedUser._id, "Resume": loggedUser.Resume}
                    }
                });
                await User.updateOne({
                    _id: loggedUser._id
                }, {
                    $push: {
                        appliedPlacements: placement._id
                    }
                });
                console.log(placement.registeredUsers);
                req.flash('success_messages', 'You have applied for placement ' + placement.placementTitle);
                res.redirect('back');
            }
        }

    } catch (err) {
        console.log(err);
    }
});

module.exports = router;