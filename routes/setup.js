var express = require('express');
var _       = require('lodash');
var router  = express.Router();

var user    = require('../models/usermodel');
var file    = require('../helpers/files');
var auth    = require('../middleware/auth');
var alt     = require('../models/AlternateModel');


/* Setup page. */
router.post('/avatar', auth.authenticate, function(req, res, next) {
    file.scan(req.files.file, (err, file) => {
      if(err.status === true){
        return res.send(err.message);
      }
      file.move_to('users_profile_pictures');
      
      return req.InteriorUser.AddAvatar(file.filename).then(() => {
        alt.findByIdAndUpdate(req.InteriorUser._id, {$set: {avatar:file.filename}}, {new: true}).then((user) => {
          res.redirect('back');
        });
        
      });
    });
});



module.exports = router;

  