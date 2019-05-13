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

router.get('/sides', auth.authenticate, auth.findAll, function(req, res, next) {
  S_F        = req.kolors;
    post.findByClass().then((blog) => {
      res.render('fragments/sideViews',{
       S_F,blog 
      });
    })
});

router


module.exports = router;
