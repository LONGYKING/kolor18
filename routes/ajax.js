var express = require('express');
var _       = require('lodash');
var router  = express.Router();

var user    = require('../models/usermodel');
var {post}    = require('../models/postmodel');
var feeds   = require('../models/activitymodel');
var auth    = require('../middleware/auth');
var alt     = require('../models/AlternateModel');
var {GetFriendRequests} = require('../models/RelationModel');

/* GET home page. */
router.get('/post/:id', auth.authenticate, function(req, res, next) {

  post.findById({_id : req.params.id}).then((post) => {

    res.render('fragments/sharePost', {post});

  }).catch((e) => {

      res.send(e);

  });
});


module.exports = router;
