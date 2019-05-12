var express = require('express');
var _       = require('lodash');
var auth    = require('../middleware/auth');
var user    = require('../models/usermodel');
const {ObjectID} = require('mongodb');
var {findFriends} = require('../models/RelationModel');

var router = express.Router();

/* GET users listing. */
router.get('/pinfo', auth.authenticate, function(req, res, next) {
  res.render('pinfo',req.InteriorUser);
});

router.get('/setup_account', auth.authenticate, function(req, res, next) {
  res.render('accontset1',req.InteriorUser);
});

router.get('/setup_security', auth.authenticate, function(req, res, next) {
  res.render('accpass',req.InteriorUser);
});

router.get('/hoppies', auth.authenticate, function(req, res, next) {
  res.render('hobi',req.InteriorUser);
});

router.get('/register', auth.active, function(req, res, next){
  res.render('register');
});

router.get('/friends', auth.authenticate, function(req, res, next){
  findFriends(req.InteriorUser._id).then((friends) => {
    res.send(friends);
  }).catch((e) => {
    res.send(e);
  });
});

router.post('/update', auth.authenticate, function(req, res, next) {
  if (!ObjectID.isValid(req.InteriorUser._id)) {
    return res.status(404).send();
  }

  user.findByIdAndUpdate(req.InteriorUser._id, {$set: req.body}, {new: true}).then((user) => {
    if (!user) {
      return res.status(404).send();
    }

    res.redirect('back');
  }).catch((e) => {
    res.status(400).send();
  });
  

});

router.post('/security', auth.authenticate, function(req, res, next) {
  if (!ObjectID.isValid(req.InteriorUser._id)) {
    return res.status(404).send();
  }
    var body = _.pick(req.body, ['Password']);
    return user.findByCredentials(req.InteriorUser.Email, req.body.Old_Password).then((user) => {
      if(req.body.Password !== req.body.confirm){
        return res.status(404).send('confirmation false');
      }
      user.Password=body.Password;
      user.save();
      return res.redirect('/');
    }).catch((e) => {
      return res.status(400).send('old password is incorrect'+body.Old_Password+e);
    });
});

module.exports = router;
