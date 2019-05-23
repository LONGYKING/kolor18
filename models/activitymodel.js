const validator = require('validator');
const _         = require('lodash');
const {ObjectID}= require('mongodb');

const mongoose  = require('../config/config');
const clone     = require('../clones/model_rules');
const post      = require('./postmodel');

/**
 * ############# **POST_MODEL_CLONE** ###############
 * @object  object contains private **cloneable** meta datas[meta_data] for [ActivitySchema]
*/

var ActivitySchema  = new mongoose.Schema({

author          : {
    type        : Object,
    required    : true
},

Tip             : {},

to_author       : {
    type        : Object,
    default     : 'public'
},

argument        : {
    type        : Object,
},
Kind            : {
    type        : String
},

time            : clone.time,

Activities_meta : {
    /**
     * @type **POSTS** **ADVERTS** **EVENTS**
     */
    

}

});

var systematic_flow = function (arg,type) {
    if(type === 'news'){

        return {
            "$or" : [
                {
                    "$and" : [
                        {
                            "timelines.author"    : new ObjectID(`${arg}`)
                        }, 
                        {
                            "timelines.to_author" : 'public'
                        }
                        ,
                        {
                            "posts.postObj" : "users"
                        }
                    ]
                }, 
                {
                    "timelines.to_author" : new ObjectID(`${arg}`)
                },
                {
                    "$and" : [
                        {
                            "relations.follow"    : new ObjectID(`${arg}`)
                        }, 
                        {
                            "timelines.to_author" : 'public'
                        },
                        {
                            "posts.postObj" : "users"
                        }

                    ]
                }
            ]
        }
    }

    if(type === 'single'){
        return {
            "timelines._id" : new ObjectID(`${arg}`)
        }
    }

    if(type === 'blog'){
        return {
            "posts.postObj" : "blog"
        }
    }
    
    };

ActivitySchema.methods.getArgument = function (argument) {
    var activity   = this;
 
    activity.argument   = new ObjectID(`${argument}`);
 
    return activity.save().then(() => {
    return argument;
   });
 }

 ActivitySchema.methods.shareActivity = function (argument, Tip, to_author) {
    
    var activity   = this;
 
    activity.argument   = new ObjectID(`${argument}`);

    if(typeof to_author !== 'undefined'){
        activity.to_author =  new ObjectID(`${to_author}`);
    }
    activity.Tip        = Tip;
 
    return activity.save().then(() => {
    return activity;
   });
 }

var activity = mongoose.model('Timeline', ActivitySchema);

var findByInterest = function (auth, type = 'news') {
    return activity.aggregate(
        [
            { 
                "$project" : {
                    
                    "timelines" : "$$ROOT"
                }
            },
            { 
                "$lookup" : {
                    "localField" : "timelines.argument", 
                    "from" : "posts", 
                    "foreignField" : "_id", 
                    "as" : "posts"
                }
            }, 
            { 
                "$unwind" : {
                    "path" : "$posts", 
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
                    "path"
                     : "$users", 
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
                "$lookup" : {
                    "localField" : "timelines.author", 
                    "from" : "relations", 
                    "foreignField" : "author", 
                    "as" : "relations"
                }
            },
            { 
                "$lookup" : {
                    "localField" : "timelines.author", 
                    "from" : "alternates", 
                    "foreignField" : "_id", 
                    "as" : "alternates"
                }
            },    
            { 
                "$match" : systematic_flow(auth, type)
            },
            { 
                "$sort" : {
                    "timelines.time" :-1
                }
            },  
            { 
                "$project" : {
                    "timelines.time"      : "$timelines.time",
                    "timelines.author"    : "$timelines.author",
                    "timelines._id"       : "$timelines._id",
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
                    "posts.postObj"       : "$posts.postObj",
                    "relations._id"       : "$relations._id",
                    "metaactivities.Activities" : "$metaactivities.Activities",
                    "metaactivities.activity" : "$metaactivities.activity",
                    "metaactivities._id" : "$metaactivities._id",
                    "relations.author"  : "$relations.author",
                    "relations.status"  : "$relations.status",
                    "alternates.firstname"  : "$alternates.firstname",
                    "alternates.lastname"  : "$alternates.lastname",
                    "alternates.avatar"  : "$alternates.avatar"
                   
                   
                }
            }, 
            { 
                "$skip" : 0
            },
            { 
                "$limit" : 10
            }
        ], 
        function (error, data){  
            return Promise.resolve(data);
        }
        
    ).allowDiskUse(true);
}

var findByUserActivity = function (auth) {
    
    return activity.aggregate(
        [
            { 
                "$project" : {
                    
                    "timelines" : "$$ROOT"
                }
            }, 
            { 
                "$lookup" : {
                    "localField" : "timelines.argument", 
                    "from" : "posts", 
                    "foreignField" : "_id", 
                    "as" : "posts"
                }
            }, 
            { 
                "$unwind" : {
                    "path" : "$posts", 
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
                "$lookup" : {
                    "localField" : "timelines.author", 
                    "from" : "alternates", 
                    "foreignField" : "_id", 
                    "as" : "alternates"
                }
            },  
            { 
                "$match" : {
                    "$or" : [
                        {
                            "timelines.author"    : new ObjectID(`${auth}`)
                        }, 
                        {
                            "timelines.to_author" : new ObjectID(`${auth}`)
                        }
                    ]
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
                    "metaactivities._id" : "$metaactivities._id",
                    "alternates.firstname"  : "$alternates.firstname",
                    "alternates.lastname"  : "$alternates.lastname",
                    "alternates.avatar"  : "$alternates.avatar"   
                   
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


module.exports = {activity,findByUserActivity,findByInterest};


