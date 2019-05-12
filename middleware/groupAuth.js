var group = require('../models/groupmodel');
var groupRequest = require('../models/groupmodel');
var {post} = require('../models/postmodel');


//middleware that gets the groups created by kolor18
var findGroups = (req, res, next) => {
    var groupid = req.params.id;
    group.findGroupByName(groupid).then((group) => {
        if (!group) {
            return Promise.reject();
        }

        req.foundGroup = group;
        next();
    }).catch((e) => {
        res.status(401).redirect('/');
    });
};

//middleware that gets the group request based on the group name
var findGroupRequest = (req, res, next) => {
    var group_name = req.params.id;

    //getting the group requests
    groupRequest.findByMain(group_name).then((group_requests) => {

       if (!group_requests) {
           return Promise.reject();
       }

       req.requests = group_requests;
       next();
    }).catch((e) => {
        res.status(401).redirect('/');
    });
};

//getting the group post based on the group name
var findGroupPosts = (req, res, next) => {
    var groupname = req.params.id;
    post.findByAuthor(req.InteriorUser._id).then((groupPost) => {
        if (!groupPost) {
            return Promise.reject();
        }
        req.FoundGroupPost = groupPost;
        next();
    }).catch((e) =>{
        res.redirect('/');
    })
}
module.exports = { findGroups, findGroupPosts, findGroupRequest};