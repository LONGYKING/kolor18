var express        = require('express');
var _              = require('lodash');
var router         = express.Router();

var {user}           = require('../models/usermodel');
var file           = require('../helpers/files');
var auth           = require('../middleware/auth');
var {request}      = require('../models/RequestModel');
var {ConnectUsers,relation} = require('../models/RelationModel');

router.get('/Connect/:req', auth.authenticate, auth.findRequest, function(req, res, next) {
    var r = new relation({author : req.activate.pend, follow : req.InteriorUser._id, status : 'true'});
    r.save().then((R) => {
        return req.activate.FullDuplex().then(() => {
            res.redirect('back');
        });

    });
    
   
});

router.get('/Friend/:id', auth.authenticate, auth.finduser, function(req, res, next) {
    
    var r = new relation({author: req.ExteriorUser._id, pend : req.InteriorUser._id});
    r.save().then((R) => {
        res.redirect('back');
    });
});

module.exports = router;
