const validator = require('validator');
const _         = require('lodash');

const mongoose  = require('../config/config');
const clone     = require('../clones/model_rules');
//const moment  = require('moment');

/////////// POST MODEL CLONE ///////////////

const meta_data = {
  text          : String,
  judge         : String,
  time          : clone.time,
}

//////////////////////////////////////////////

var MediaSchema  = new mongoose.Schema({

activity        : {
  type          : Object
},

author          : {
  type          : Object
},

Activities      : {
  comments      : [{
  text          : String,
  judge         : String,
  time          : clone.time,
  replies       : meta_data

  }],

  Likes         : [{
    kind        : {},
    judge       : {}
  }],
  Share         : [{
    From        : {},
    To          : {}
  }]
}

});

MediaSchema.statics.findByType = function (type) {
  var MetaActivity = this;

  return MetaActivity.find({
    'type': type,
  }).then((media) => {
      return media;
  });
  
}

MediaSchema.statics.findByFamily = function (Family) {
    var MetaActivity = this;
  
    return MetaActivity.find({
      'argument': family,
    }).then((media) => {
        return media;
    });
    
  }

  MediaSchema.statics.findByActivity = function (activity) {
    var MetaActivity = this;
  
    return MetaActivity.find({
      'activity': activity,
    }).then((media) => {
        return media;
    });
    
  }

var MetaActivity = mongoose.model('metaActivity', MetaActivitySchema);