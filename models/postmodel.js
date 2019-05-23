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

var PostSchema  = new mongoose.Schema({

activity        : {
  type          : Object
},

title           : {
    type        : String
},

postObj         : {
    type        : String,
    default     : "users"
},

mainObj         : {
    type        : String
},

postcontent     : [{
  text          : {},
  fontsize      : {}
}],

Media           : {
  File          : [{
    File        : {},
    Type        : {}
  }]
},

time            : clone.time,

author          : {
  type          : Object
},

});

PostSchema.methods.toJSON = function () {
  var post = this;
  var postObject = post.toObject();

  return _.pick(postObject, ['_id', 'Email', 'firstname']);
}


PostSchema.statics.findByAuthor = function (auth,id) {
    var post = this;
  
    return post.find({
      '_id': id,
    }).then((post) => {
        return post;
    });
    
}

PostSchema.statics.findByClass = function (classi = "blog") {
  var post = this;

  return post.find({
    postObj : classi,
  }).then((post) => {
      return post;
  });
  
}

PostSchema.methods.AddFile = function (File,Type) {
  var post   = this;

  post.Media.File.push({File,Type});

  return post.save().then((post) => {
  return post;
 });
}

var post = mongoose.model('post', PostSchema);

var findByClassification = function ($class) {
    
  return post.aggregate(
      [
          { 
              "$project" : {
                  
                  "posts" : "$$ROOT"
              }
          }, 
          { 
              "$lookup" : {
                  "localField" : "posts._id", 
                  "from" : "timelines", 
                  "foreignField" : "argument", 
                  "as" : "timelines"
              }
          }, 
          { 
              "$unwind" : {
                  "path" : "$timelines", 
                  "preserveNullAndEmptyArrays" : false
              }
          }, 
          { 
              "$lookup" : {
                  "localField" : "posts.author", 
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
              "$lookup" : {
                  "localField" : "timelines._id", 
                  "from" : "metaactivities", 
                  "foreignField" : "activity", 
                  "as" : "metaactivities"
              }
          }, 
          { 
              "$unwind" : {
                  "path" : "$metaactivities", 
                  "preserveNullAndEmptyArrays" : false
              }
          },  
          { 
              "$sort" : {
                  "timelines.time" :-1
              }
          },  
          { 
              "$project" : {
                  "timelines.time"      : "$timelines.time",
                  "timelines._id"      : "$timelines._id",
                  "timelines.to_author" : "$timelines.to_author",
                  "timelines.Tip"       : "$timelines.Tip", 
                  "users.firstname"     : "$users.firstname", 
                  "users.lastname"      : "$users.lastname", 
                  "users.avatar"        : "$users.avatar", 
                  "posts.author"        : "$posts.author", 
                  "posts.postcontent"   : "$posts.postcontent",
                  "posts._id"           : "$posts._id", 
                  "posts.time"          : "$posts.time",
                  "posts.Activities"    : "$posts.Activities",
                  "posts.Media"         : "$posts.Media",
                  "metaactivities.Activities" : "$metaactivities.Activities",
                  "metaactivities.activity" : "$metaactivities.activity",
                  "metaactivities._id" : "$metaactivities._id"   
                 
              }
          }, 
          { 
              "$skip" : 0
          },
          { 
              "$limit" : 5
          }
      ], 
      function (error, data){  
          return Promise.resolve(data);
      }
  ).allowDiskUse(true);
  
}

module.exports = {post,findByClassification};
