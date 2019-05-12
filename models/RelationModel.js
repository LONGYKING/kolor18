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

var RelationSchema  = new mongoose.Schema({

activity        : {
  type          : Object
},

time            : clone.time,

author          : {
  type          : Object
},

pend            : {
  type          : Object
},

follow          : {
    type        : Object
},

status          : {
  type          : String,
  default       : 'false'
}

});

RelationSchema.methods.FullDuplex = function () {
  var relation   = this;

  relation.status = 'true';
  relation.follow = relation.pend;

  return relation.save().then((relation) => {
  return relation;
 });
}

var relation = mongoose.model('relation', RelationSchema);

var findFriends = function (user) {

    return relation.aggregate(
        [
            { 
                "$project" : {
                    "relations" : "$$ROOT"
                }
            }, 
            { 
                "$lookup" : {
                    "localField" : "relations.follow", 
                    "from" : "users", 
                    "foreignField" : "_id", 
                    "as" : "users"
                }
            }, 
            { 
                "$unwind" : {
                    "path" : "$users", 
                    "preserveNullAndEmptyArrays" : false
                }
            }, 
            { 
                "$match" : {
                    "relations.author" : new ObjectID(`${user}`)
                }
            }, 
            { 
                "$project" : {
                    "users.firstname" : "$users.firstname", 
                    "users.lastname" : "$users.lastname", 
                    "users._id" : "$users._id", 
                }
            }
        ], 
        function (error, data){  
            return Promise.resolve(data);
        }
    ).allowDiskUse(true);

}

var GetFriendRequests = function(userID){
  return relation.aggregate(
      [
          { 
              "$project" : {
                  "relations" : "$$ROOT"
              }
          }, 
          { 
              "$lookup" : {
                  "localField" : "relations.pend", 
                  "from" : "users", 
                  "foreignField" : "_id", 
                  "as" : "users"
              }
          }, 
          { 
              "$unwind" : {
                  "path" : "$users", 
                  "preserveNullAndEmptyArrays" : false
              }
          },  
          { 
              "$match" : {
                  "relations.author" : new ObjectID(`${userID}`),
                  "relations.status" : 'false'
              }
          },
          { 
              "$sort" : {
                  "relations.time" :-1
              }
          },  
          { 
              "$project" : {
                  "relations.pend" : "$relations.pend",
                  "relations._id" : "$relations._id", 
                  "users.firstname" : "$users.firstname", 
                  "users.lastname" : "$users.lastname", 
                  "users.avatar" : "$users.avatar", 
                  "users._id" : "$users._id"
              }
          }
      ], 
      function (error, data){  
          return Promise.resolve(data);
      }
  ).allowDiskUse(true);
}

module.exports = {relation,GetFriendRequests,findFriends};