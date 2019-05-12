const validator = require('validator');
const _ = require('lodash');
const mongoose = require('../config/config');

var groupSchema = new mongoose.Schema({
    groupName  : {
        type   : String,
        trim   : true,
        unique : true
    },

    groupLogo  : {
        type   : String
    },

    groupDes   : {
        type   : String,
        required: true,
        trim   : true
    },

    creator    : {
        type   : String,
        trim   : true
    },

    created    : {
        type   : Date
    }
});

//function getting the users informations
groupSchema.methods.toJSON = function () {
    var group = this;
    var groupObject = post.toObject();

    return _.pick(groupObject, ['_id', 'Email', 'firstname']);
}

//function that gets the group information
groupSchema.methods.toJSONS = function(){
    var group = this;
    var groupObject = postMessage.toObject();

    return _.pick(groupObject, ['_id', 'groupName']);
};

//function that finds the groups using the group name and the logged in user
groupSchema.statics.findGroupByName = function (gname) {
    var group = this;

    return group.find({ groupName: gname}).then((group) => {

        return Promise.resolve(group);

    });
}

//function that get groups
groupSchema.statics.findMyGroups = function (creators) {
    var group = this;

    return group.find({creator: creators}).then((groups) => {
        return Promise.resolve(groups);
    });
}

//function that get suggested group for users
groupSchema.statics.suggestGroups = function (creators, groupname) {
    var group = this;

    return group.find({creator: {$ne:creators}}).then((suggestGroup) => {
        return Promise.resolve(suggestGroup);
    });
}

var group = mongoose.model('group', groupSchema);

module.exports = group;