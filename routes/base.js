var express = require('express');
var _       = require('lodash');
const mailer   = require('nodemailer');
var router  = express.Router();

var {user}    = require('../models/usermodel');
var {post}  = require('../models/postmodel');
var feeds   = require('../models/activitymodel');
var auth    = require('../middleware/auth');

var alt     = require('../models/AlternateModel');
var {GetFriendRequests} = require('../models/RelationModel');

/* GET home page. */
router.get('/@/:id', auth.authenticate,auth.finduser, function(req, res, next) {

  feeds.findByUserActivity(req.ExteriorUser._id).then((Feeds) => {
    
    Interior   = req.InteriorUser;
    Exterior   = req.ExteriorUser;
    
    res.render('userprofile',{
      Interior,Exterior,Feeds 
    });

    
  }).catch((e) => {
    res.send(e);
  });
  
});

router.get('/FriendRequest', auth.authenticate, function(req, res, next) {
  
  GetFriendRequests(req.InteriorUser._id).then((request) => {
    
    Interior   = req.InteriorUser;
    
    res.render('friendreq',{
      Interior,request 
    });
  }).catch((e) => {
    res.send(e);
  });
});

router.get('/about/:id', auth.authenticate,auth.finduser, function(req, res, next) {
  Interior   = req.InteriorUser;
  Exterior   = req.ExteriorUser;
  
  res.render('about',{
    Interior,Exterior
  });
});

router.get('/photo_of/:id', auth.authenticate,auth.finduser, function(req, res, next) {
  Interior   = req.InteriorUser;
  Exterior   = req.ExteriorUser;
  res.render('userphoto',{
    Interior,Exterior
  });
});

router.get('/', auth.authenticate, function(req, res, next) {
  
  feeds.findByInterest(req.InteriorUser._id).then((Feeds) => {
    
    Interior   = req.InteriorUser;
    
      res.render('index',{
        Interior,Feeds,
      });
    }).catch((e) => {
      res.send(e);
    });
});



router.get('/register', auth.active, function(req, res, next){
  res.render('register');
});



router.post('/register', function(req, res, next){
  req.body.avatar = req.body.Gender == 'male' ? 'male.png' : 'female.png';
  var u = new user(req.body);
  u.save().then((user) => {
    var alternate = new alt(user.toJSON());
    alternate.save();
    return u.generateAuthToken();
  }).then((token) => {

    req.session.x_auth = token;
    res.header('x-auth', token).redirect('/auth');
  }).catch((e) => {
    return res.send(e);
    res.status(400).redirect('/register',{e});
  });
});

router.get('/auth', auth.authenticate, function(req, res, next){
  res.render('verification');
});


// POST /users/login {email, password}
router.post('/login', (req, res) => {
  var body = _.pick(req.body, ['Email', 'Password']);

  user.findByCredentials(body.Email, body.Password).then((user) => {
    return user.generateAuthToken().then((token) => {
      req.session.x_auth = token;
      res.header('x-auth', token).redirect('/');
    });
  }).catch((e) => {
    res.status(400).redirect('/register', 400, {error});
  });
});
module.exports = router;
