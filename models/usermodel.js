const validator = require('validator');
const jwt       = require('jsonwebtoken');
const _         = require('lodash');
const bcrypt    = require('bcryptjs');

const clone     = require('../clones/model_rules');
const mongoose  = require('../config/config');
const {ObjectID}= require('mongodb');


var UserSchema  = new mongoose.Schema({
Email           : {
   type         : String,
   required     : true,
   trim         : true,
   minlength    : 1,
   unique       : true,
   validate     : {
   validator    : validator.isEmail,
   message      : '{VALUE} is not a valid email'
   }
},
Password        : {
   type         : String,
   require      : true,
   minlength    : 6
  },
firstname       : {
  type          : String,
  required      : true,
},

lastname        : {},

Phone           : {},

Website         : {},

Dob             : {},

Country         : {
  type          : String,
  required      : true,
},

Province        : {},

City            : {
  type          : String,
  required      : true,
},

About           : {},

Gender          : {
  type          : String,
  required      : true,
},

Belifs          : {},

Birthplace      : {},

day_o_b         : {
  type          : Number,
  required      : true,
},

month_o_b       : {
  type          : String,
  required      : true,
},

year_o_b        : {
  type          : Number,
  required      : true,
},

Occupation      : {},

Status          : {},

Political       : {},

Facebook_Account: {},

Twitter_Account : {},

RSS             : {},

Hobbies         : {},

Favourite_TV_Shows: {},

Favourite_Movies : {},

Favourite_Games  : {},

Favourite_Bands  : {},

Favourite_Books  : {},

Favourite_Writers: {},

Other_Interests  : {},

avatar           : {
  type           : String,
  default        : 'avatar.jpg'
},

Tokens          : [{
   access       : {
   type         : String,
   required     : true
   },
   token        : {
   type         : String,
   required     : true
  }
  }],

Created_at      : clone.time
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'Email', 'firstname', 'lastname', 'avatar']);
}

UserSchema.methods.generateAuthToken = function () {
   var user   = this;
   var access = 'auth';
   var token  = jwt.sign({_id: user._id.toHexString(), access}, 'kolor18').toString();

   user.Tokens.push({access, token});

   return user.save().then(() => {
   return token;
  });
}


UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'kolor18');
  } catch (e) {
    return Promise.reject(e);
  }

  return User.findOne({
    '_id': decoded._id,
    'Tokens.token': token,
    'Tokens.access': 'auth'
  });
}

UserSchema.statics.findByCredentials = function (Email, password) {
  var User = this;
  

  return User.findOne({Email}).then((user) => {
  
    if (!user) {
      return Promise.reject('failed');
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.Password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject('false');
        }
      });
    });
  });
}

UserSchema.methods.AddAvatar = function (avatar) {
  var user   = this;

  user.avatar = avatar;

  return user.save().then((user) => {
  return user;
 });
}

UserSchema.statics.findByUsername = function (firstname) {
  var User = this;
  

  return User.findOne({firstname}).then((user) => {
    if (!user) {
      return Promise.reject('failed');
    } else {
      return Promise.resolve(user);
    }

  });
}

UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('Password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.Password, salt, (err, hash) => {
        user.Password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var user = mongoose.model('user', UserSchema);

var birthday = (auth) => {
  return user.aggregate(
    [
        { 
            "$project" : {
                "users" : "$$ROOT"
            }
        }, 
        { 
            "$lookup" : {
                "localField" : "users._id", 
                "from" : "relations", 
                "foreignField" : "author", 
                "as" : "relations"
            }
        }, 
        { 
            "$unwind"  : {
                "path" : "$relations", 
                "preserveNullAndEmptyArrays" : false
            }
        }, 
        { 
            "$match" : {
                "relations.follow" : new ObjectID(`${auth}`),
                "users.day_o_b" : 29,
                "relations.status" : "true", 
                "users.month_o_b"  : "Febuary"
                
                
            }
        }, 
        { 
            "$project" : {
                "users.firstname"  : "$users.firstname", 
                "users.lastname"   : "$users.lastname", 
                "users.avatar"     : "$users.avatar", 
                "users.Gender"     : "$users.Gender", 
            }
        }
    ], 
    function (error, data){  
        return Promise.resolve(data);
    }
).allowDiskUse(true);
}

module.exports = {user, birthday};
