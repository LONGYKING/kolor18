const validator  = require('validator');
const _          = require('lodash');
const {ObjectID} = require('mongodb');
const mongoose   = require('../config/config');
const clone      = require('../clones/model_rules');
//const moment  = require('moment');

var AlternateSchema  = new mongoose.Schema({

  firstname       : {
    type          : String,
    required      : true,
  },
  
  lastname        : {},

  avatar          : {
    type          : String
  },

  Email           : {
    type          : String
  },

  _id          : {
      type        : Object
  }

  });




var alternate = mongoose.model('alternate', AlternateSchema);




module.exports = alternate;