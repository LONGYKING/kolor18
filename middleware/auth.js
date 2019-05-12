var user         = require('../models/usermodel');
var {post}       = require('../models/postmodel');
var  meta        = require('../models/MetaActivityModel');
var {activity}   = require('../models/activitymodel');
var {relation}   = require('../models/RelationModel');

const {ObjectID} = require('mongodb');

var authenticate = (req, res, next) => {
  var token = req.session.x_auth;
  user.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    
    req.InteriorUser = user;
    req.token = token;
    req.body.author      = user._id;
    next();
  }).catch((e) => {
    res.status(401).redirect('/register');
  });
};

var active = (req, res, next) => {
  if(typeof req.session.x_auth !== 'undefined'){
   return res.redirect('/');
  }else{
    next();
  }
};

var finduser = (req, res, next) => {

  var userid = req.params.id;

  user.findByUsername(userid).then((user) => {

    if (!user) {
      return Promise.reject();
    }
    
    req.ExteriorUser = user;

    next();
  }).catch((e) => {
    res.status(401).redirect('/');
  });
};

var findMeta = (req, res, next) => {

  meta.findById({
    '_id': new ObjectID(`${req.params.activity}`),
  }).then((meta) => {
    
    req.meta = meta

    next();

  }).catch((e) => {

    res.redirect('back');

  });
}

var watch_activity = function(req, res, next){
  
  var a = new activity({author : req.InteriorUser._id});

  a.save().then((act) => {

      //########## ACIVITY PRIVILEDGED ##################//
      var m = new meta({activity : act._id});
      m.save();
      //################################################//

      req.activity = act;
      req.body.activity    = act._id;

      next();

  }).catch((e) => {

      res.send(e);

  });
}

var findRequest = function(req, res, next){
  relation.findById({_id:req.params.req}).then((request) => {
    req.activate = request;
    next();
  }).catch((e) => {
    res.send(e);
  });
  
}

var findAll = (req, res, next) => {

  user.find({}).then((user) => {
    
    req.kolors = user;

    next();
  }).catch((e) => {
    res.status(401).redirect('/');
  });
};

var findPost = (req, res, next) => {

post.findById({_id : new ObjectID(`${req.body.argument}`)}).then((post) => {
  if(post){
    
    req.post = post;
    next();
    
  }else{
    res.send('this post no longer exist');
  }
}).catch((e) => {
    res.send(e);
});

}


module.exports = {
  authenticate,
  active,finduser,
  findMeta,
  watch_activity,
  findRequest,
  findAll,
  findPost
};