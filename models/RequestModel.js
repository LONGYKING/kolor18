const validator  = require('validator');
const _          = require('lodash');
const {ObjectID} = require('mongodb');
const mongoose   = require('../config/config');
const clone      = require('../clones/model_rules');
//const moment  = require('moment');

var RequestSchema  = new mongoose.Schema({

time            : clone.time,

key          : {
  type          : Object
},

});




var request = mongoose.model('request', RequestSchema);




module.exports = {request};