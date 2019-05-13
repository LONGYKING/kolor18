var express          = require('express');
var _                = require('lodash');
var router           = express.Router();
var feeds   = require('../models/activitymodel');
var texts            = require('../helpers/text');
var {post,findByClassification}           = require('../models/postmodel');
var file             = require('../helpers/files');
var auth             = require('../middleware/auth.js');
var {activity}       = require('../models/activitymodel');

/**
 * activity should only save after post confirmation **Pending**
 */

router.post('/', auth.authenticate, auth.watch_activity, function(req, res, next){
      if(req.body.postcontent === "" && typeof req.files.file  === 'undefined'){
          return res.redirect('back');
        }

      req.body.postcontent = {text: req.body.postcontent.trim(), fontsize: texts.format(`${req.body.postcontent}`)};
      var p                = new post(req.body);

      p.save().then((post) => {
        
        return req.activity.getArgument(post._id);

      }).then((activity) => {


        if(typeof req.files.file != 'undefined'){

          file.scan(req.files.file, (err, file) => {

            if(err.status === true){

              return res.send(err.message);

            }
            file.move_to('post');

            return p.AddFile(file.filename,file.type);
          });
        }

        res.redirect('back');

      }).catch((e) => {

        res.status(404).send(e);

      });
});

router.post('/comment_on/:activity', auth.authenticate, auth.findMeta, function(req, res, next){
 
    return req.meta.comment(req.body.text, req.InteriorUser._id, req.InteriorUser.toJSON()).then((Meta) => {
    
      res.redirect('back');

    }).catch((e) => {
      
      res.send(e);

    });
});

router.get('/like/:activity', auth.authenticate, auth.findMeta, function(req, res, next) {

  return req.meta.like(req.InteriorUser._id, req.InteriorUser.toJSON()).then((meta) => {

    res.render('fragments/activityPanel', {meta});

  }).catch((e) => {

    res.send(e);
    
  });
});

router.get('/delete/:activity', auth.authenticate, function(req, res, next) {
    
    activity.remove({_id:req.params.activity,author:req.InteriorUser._id}).then((activity) => {
        
        res.redirect('back');
    });
    
});

router.get('/panel/:activity', auth.authenticate, function(req, res, next) {
  var Feed = JSON.parse(req.params.activity);
  res.render('fragments/viewPost', {Feed});
  
});

router.post('/share', auth.authenticate, auth.findPost, auth.watch_activity, function(req, res, next) {
  return req.activity.shareActivity(req.post._id, req.body.Tip, req.body.to_author).then((post) => {
    return req.meta.share(req.InteriorUser.toJSON());
  }).then((activity)=>{
    
      res.redirect('back');
  
  }).catch((e) => {
    res.send(e);
  });
});

module.exports = router;
