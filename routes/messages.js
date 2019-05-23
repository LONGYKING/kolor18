var express = require('express');
var _       = require('lodash');
var router  = express.Router();

var {user}    = require('../models/usermodel');
var file    = require('../helpers/files');
var auth    = require('../middleware/auth');
var alt     = require('../models/AlternateModel');


/* Setup page. */
router.get('/', auth.authenticate, function(req, res, next) {
    
    res.render('chatmsg');
});



module.exports = router;

  