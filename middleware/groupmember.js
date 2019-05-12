//import default from 'validator/lib/isFullWidth';

const validator = require('validator');
const _ = require('lodash');
const mongoose = require('../config/config');
//const moment    = require('moment');


var memberSchema = new mongoose.Schema({

    member: {},

    //getting the type of member eg group/ pages
    Obj: {
        type: String
    },

    //getting the actual obj eg group name of page name
    mainObj: {
        type: String
    },

    //setting default values for checking blocked members
    status: {
        type: String,
        default: 'active'
    },

    time: {
        type: Number,
        default: new Date().getTime()
    }

});

//function getting the users informations
memberSchema.methods.toJSON = function () {
    var member = this;
    var memberObject = member.toObject();

    return _.pick(memberObject, ['_id', 'Email', 'firstname']);
}

//function that finds the member using the logged in user
memberSchema.statics.findByAuthor = function (auth) {
    var member = this;


    return member.find({ author: auth }).then((member) => {

        return Promise.resolve(member);

    });
}

//function that gets the members in a group
memberSchema.statics.findMembers = function(main, checks){
    var member = this;
    
    return member.find({mainObj: main, status: checks}).then((members) => {
        return Promise.resolve(members);
    });
}

//function that gets the groups by groupName
memberSchema.statics.getGroupsByName = function(name){
    var member = this;

    return member.find({mainObj: name}).then((members) => {
        return Promise.resolve(members);
    })
}

//function to update members in the group
memberSchema.statics.updateMember = function(members, stat){
    var member = this;

    return member.updateOne({member: members}, {$set: {status: stat}}).then((members) => {
        return Promise.resolve(members);
    });
}


var member = mongoose.model('member', memberSchema);

module.exports = member;
