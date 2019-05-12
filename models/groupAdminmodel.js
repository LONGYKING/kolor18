const validator = require('validator');
const _ = require('lodash');
const mongoose = require('../config/config');
//const moment    = require('moment');


var adminSchema = new mongoose.Schema({

    adminName: {},

    //what category of the admin eg group, pages
    adminObj: {
        type: String
    },

    //the actual object
    mainObj: {
        type: String
    },

    time: {
        type: Number,
        default: new Date().getTime()
    }

});

//function getting the users informations
adminSchema.methods.toJSON = function () {
    var admin = this;
    var adminObject = admin.toObject();

    return _.pick(adminObject, ['_id', 'Email', 'firstname']);
}

//suggesting groups that the current user has not sent admin to
adminSchema.statics.getAdminByGroupName = function (group_id) {
    var admin = this;

    return admin.find({ mainObj: group_id }).then((admins) => {
        return Promise.resolve(admins);
    });
}

//deleting group Admin
adminSchema.statics.deleteAdmin = function(name){
    var admin = this;

    return admin.deleteOne({adminName: name}).then((admins) => {
        return Promise.resolve(admins);
    });
}

var admin = mongoose.model('admin', adminSchema);

module.exports = admin;
