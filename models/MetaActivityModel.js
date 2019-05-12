const validator  = require('validator');
const _          = require('lodash');
const {ObjectID} = require('mongodb');
const mongoose   = require('../config/config');
const clone      = require('../clones/model_rules');
//const moment  = require('moment');

/////////// POST MODEL CLONE ///////////////

const meta_data = {
  text          : String,
  judge         : String,
  time          : clone.time,
}

//////////////////////////////////////////////

var MetaActivitySchema  = new mongoose.Schema({

activity        : {
  type          : Object
},

time            : clone.time,

author          : {
  type          : Object
},

Activities      : {
  comments      : [{
  text          : String,
  judge         : String,
  time          : clone.time,
  replies       : meta_data,
  pack          : Object,

  }],

  Likes         : [{
  kind          : {},
  judge         : {},
  pack          : Object,
  }],

  shares        : [{
  pack          : Object,
  }],

  Share         : [{
    From        : {},
    To          : {}
  }]
}

});

MetaActivitySchema.statics.findByActivity = function (activity) {
  var MetaActivity = this;

  return MetaActivity.find({
    'activity': new ObjectID(`${activity}`),
  }).then((meta) => {
      return Promise.resolve(meta);
  }).catch((e) => {
      return Promise.reject(e);
  });
  
}

MetaActivitySchema.methods.comment = function (text,judge,pack) {
  var MetaActivity   = this;

  MetaActivity.Activities.comments.push({text, judge, pack});

  return MetaActivity.save().then((meta) => {
  return meta;
 });
}

MetaActivitySchema.methods.like = function (judge,pack) {
  var MetaActivity   = this;

  MetaActivity.Activities.Likes.push({kind:'like', judge, pack});

  return MetaActivity.save().then((meta) => {
  return meta;
 });
}

MetaActivitySchema.methods.share = function (pack) {
  var MetaActivity   = this;

  MetaActivity.Activities.shares.push({pack});

  return MetaActivity.save().then((meta) => {
  return meta;
 });
}

var MetaActivity = mongoose.model('metaActivity', MetaActivitySchema);

module.exports = MetaActivity;