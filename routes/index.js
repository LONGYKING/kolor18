var express = require('express');
var _       = require('lodash');
const mailer   = require('nodemailer');
var router  = express.Router();
var {generateOTP}    = require('../helpers/help');
var {user}    = require('../models/usermodel');
var {post}  = require('../models/postmodel');
var feeds   = require('../models/activitymodel');
var auth    = require('../middleware/auth');

var alt     = require('../models/AlternateModel');
var {GetFriendRequests} = require('../models/RelationModel');
var Failed  = require('../languages/success');

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

router.get('/test', function(req, res, next){
 res.sendFile('index.ejs');
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
    req.session.code = generateOTP;
    res.header('x-auth', token).redirect('/auth');
  }).catch((e) => {
    return res.send(e);
    res.status(400).redirect('/register',{e});
  });
});

router.get('/auth', auth.authenticate, function(req, res, next){
  let transporter = mailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'kingsleyonyeneke@gmail.com',
        pass: '09034128815'
    }
});
let mailOptions = {
    from: 'InstaTrend@gmail.com', // sender address
    to: req.InteriorUser.email, // list of receivers
    subject:  'VERIFICATION',
    text: `YOUR VERIFICATION CODE => ${req.session.code}`, // plain text body
    html: `<b>Hello ${req.InteriorUser.firstname} <br> your verification code => ${req.session.code}</b>` // html body
};

transporter.sendMail(mailOptions, (error, info) => {
  var message = error;
    if (error) {
        console.log(error);
        return res.send(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.render('verification',{message});
    });
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
    var error  = Failed.ToLogin;
    res.status(400).redirect('/register', 400, {error});
  });
});
module.exports = router;
