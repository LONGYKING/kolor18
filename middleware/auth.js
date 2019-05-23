var {user}         = require('../models/usermodel');
var {post}       = require('../models/postmodel');
var  meta        = require('../models/MetaActivityModel');
var {activity}   = require('../models/activitymodel');
var {relation}   = require('../models/RelationModel');
var group        = require('../models/groupmodel');

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
};

var verifykey = function(req, res, next){
  req.InteriorUser = {_id : "jhhhdls"};
  next();
};

var watch_activity = function(req, res, next){
  var author = typeof req.body.inhuman === 'undefined' ? req.InteriorUser._id : req.body.inhuman;
  var a = new activity({author : new ObjectID(`${author}`)});

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

//middleware that gets the groups created by kolor18
var findGroups = (req, res, next) => {

  group.findGroupByName(req.params.id).then((group) => {
      if (!group) {
          res.redirect('back');
      }

      req.foundGroup = group;
      next();
  }).catch((e) => {
      res.status(401).redirect('/');
  });
};


module.exports = {
  authenticate,
  active,
  finduser,
  findMeta,
  watch_activity,
  findRequest,
  findAll,
  findPost,
  findGroups,
  verifykey
};
