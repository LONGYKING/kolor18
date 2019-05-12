var express = require('express');
var _ = require('lodash');
var auth = require('../middleware/auth.js');
var groupAuth = require('../middleware/groupAuth.js');
var user = require('../models/usermodel');
var group = require('../models/groupmodel');
var groupMember = require('../models/groupmember');
var post = require('../models/postmodel');
var {request} = require('../models/RequestModel');
var groupAdmin = require('../models/groupAdminmodel');
var texts = require('../helpers/text');
var file  = require('../helpers/files');

const { ObjectID } = require('mongodb');

var router = express.Router();

//showing all kolor 18 groups
router.get('/kolor18', auth.authenticate, function(req, res, next){
    group.findMyGroups(req.InteriorUser._id).then((Group) => {
        Interior   = req.InteriorUser;
        Exterior   = req.ExteriorUser;

        res.render('group/group', {Interior, Exterior, Group});
    });
});

router.get("/getForm", auth.authenticate, function(req, res, next) {
    var cool = "nice one";
    res.render("text", cool);
});

//showing the individaul group feeds
router.get('/kolor18Group/:id', auth.authenticate,groupAuth.findGroups, groupAuth.findGroupPosts, function(req, res, next){
    var active = 'active';
    var block = 'blocked';
    //getting the total of admins and requests
    groupAdmin.getAdminByGroupName(req.foundGroup[0].groupName).then((admins) =>{
        //getting the group request
        request.findByMain(req.foundGroup[0].groupName).then((requests) => {
            //getting the members in a group
            groupMember.findMembers(req.foundGroup[0].groupName,active).then((members) => {
                groupMember.findMembers(req.foundGroup[0].groupName, block).then((blockedMembers) => {
                    Newuser = req.user.toJSON();
                    Newuser.groups = req.foundGroup[0].groupName;
                    Newuser.posts = req.FoundGroupPost;
                    Newuser.request = requests;
                    Newuser.members = members;
                    Newuser.blocked = blockedMembers;
                    Newuser.admin = admins;
                    Newuser.groupID = req.foundGroup[0].creator;
                    res.render('groups', Newuser);
                });
            });
        });
    });
});

//showing the blocked members
router.get('/blocked/:id', auth.authenticate, groupAuth.findGroups, groupAuth.findGroupPosts, function (req, res, next) {
    var active = 'active';
    var block = 'blocked';
    //getting the total of admins and requests
    groupAdmin.getAdminByGroupName(req.foundGroup[0].groupName).then((admins) => {
        //getting the group request
        request.findByMain(req.foundGroup[0].groupName).then((requests) => {
            //getting the members in a group
            groupMember.findMembers(req.foundGroup[0].groupName, active).then((members) => {
                groupMember.findMembers(req.foundGroup[0].groupName, block).then((blockedMembers) => {
                    Newuser = req.user.toJSON();
                    Newuser.groups = req.foundGroup[0].groupName;
                    Newuser.posts = req.FoundGroupPost;
                    Newuser.request = requests;
                    Newuser.members = members;
                    Newuser.blocked = blockedMembers;
                    Newuser.admin = admins;
                    Newuser.groupID = req.foundGroup[0].creator;
                    res.render('groupUnblock', Newuser);
                });
            });
        });
    });
});

//addin group admins
router.post('/addAdmins', auth.authenticate, function(req, res, next){
    //getting the group name
    var gname = req.body.gname;
    var admin = req.body.buddy;
    var destination = 'group';

    var adminInfo = new groupAdmin({adminName: admin, adminObj: destination, mainObj: gname});

    groupAdmin.create(adminInfo).then(() => { res.redirect('back') }).catch((e) => { res.status(404).send(e) });
});

//showing the group admins
router.get('/admins/:id', auth.authenticate, groupAuth.findGroups, function(req, res, next){
    var active = 'active';
    var block = 'blocked';
    //getting the total of admins and requests
    groupAdmin.getAdminByGroupName(req.foundGroup[0].groupName).then((admins) => {
        //getting the group request
        request.findByMain(req.foundGroup[0].groupName).then((requests) => {
            //getting the members in a group
            groupMember.findMembers(req.foundGroup[0].groupName,active).then((members) => {
                groupMember.findMembers(req.foundGroup[0].groupName, block).then((blockMembers) => {
                    Newuser = req.user.toJSON();
                    Newuser.groups = req.foundGroup[0].groupName;
                    Newuser.request = requests;
                    Newuser.members = members;
                    Newuser.blocked = blockMembers;
                    Newuser.admin = admins;
                    Newuser.groupID = req.foundGroup[0].creator;
                    res.render('groupAdmin', Newuser);
                });
            });
        });
    });
});

//showing the users groups and suggested groups//getting the user's groups in the platform
router.get('/groups',auth.authenticate,function(req, res, next ){
   group.suggestGroups(req.user.id).then((groups) => {
       //getting the groups created or joined by the current user
       group.findMyGroups(req.user.id).then((myGroups) => {
            Newuser = req.user.toJSON();
            Newuser.myGroup = myGroups;
            Newuser.group = groups;
            res.render('group', Newuser);
       });
   });
});

//sending group requests
router.get('/sendRequest/:id', auth.authenticate,groupAuth.findGroups, function(req, res, next){
    var user = req.user.firstname;
    var reqObj = 'group';
    var actualObj = req.foundGroup[0].groupName;


    var requestObj = new request({sender: user, requestObj: reqObj, requestObjId: actualObj});

    request.create(requestObj).then(() =>{ res.redirect('back')}).catch((e) => {res.status(404).send(e)});

});

//showing the list of group request
router.get('/notify/:id', auth.authenticate, groupAuth.findGroups, function(req, res, next) {
    var active = 'active';
    var block = 'blocked';
    //getting the total of admins and requests
    groupAdmin.getAdminByGroupName(req.foundGroup[0].groupName).then((admins) => {
        //getting the group request
        request.findByMain(req.foundGroup[0].groupName).then((requests) => {
            //getting the members in a group
            groupMember.findMembers(req.foundGroup[0].groupName,active).then((members) => {
                groupMember.findMembers(req.foundGroup[0].groupName, block).then((blockMembers) => {
                    Newuser = req.user.toJSON();
                    Newuser.groups = req.foundGroup[0].groupName;
                    Newuser.members = members;
                    Newuser.blocked = blockMembers;
                    Newuser.request = requests;
                    Newuser.admin = admins;
                    Newuser.groupID = req.foundGroup[0].creator;
                    res.render('groupRequest', Newuser);
                });
            });
        });
    });
});

//showing group Members
router.get('/members/:id',auth.authenticate, groupAuth.findGroups, function(req, res, next){
    var active = 'active';
    var blocked = 'blocked';
    //getting the total of admins and requests
    groupAdmin.getAdminByGroupName(req.foundGroup[0].groupName).then((admins) => {
        //getting the group request
        request.findByMain(req.foundGroup[0].groupName).then((requests) => {
            //getting the members in a group
            groupMember.findMembers(req.foundGroup[0].groupName,active).then((members) => {
                groupMember.findMembers(req.foundGroup[0].groupName, blocked).then((blockedMembers) => {
                    Newuser = req.user.toJSON();
                    Newuser.groups = req.foundGroup[0].groupName;
                    Newuser.members = members;
                    Newuser.blocked = blockedMembers;
                    Newuser.request = requests;
                    Newuser.admin = admins;
                    Newuser.groupID = req.foundGroup[0].creator;
                    res.render('groupmembers', Newuser);
                });
            });
        });
    });
});

//accepting group Requests
router.get('/accept/:id',auth.authenticate, auth.finduser,function(req, res, next){
    //getting the infos
    
    var type = 'group';
    //getting the groupname from mongo db
    request.findBySender(req.found.firstname).then((values) => {
        //getting the groupname
        var gname = values.requestObjId;

        if (values) {
            var datas = new groupMember({member: req.found.firstname, Obj: type, mainObj: gname});
            //saving data to database
            groupMember.create(datas).then((members) => {
                if (members) {
                    //deleting user request from database
                    request.deleteRequest(req.found.firstname).then((del) => {
                        res.redirect('back');
                    }).catch((e) => {
                        res.redirect('back');
                    });
                }
            }).catch((e) => {
                res.redirect('back');
            });
        }
    });
});

//deleting groupAdmin
router.get('/DeleteAdmin/:id',auth.authenticate,auth.finduser, function(req, res, next){
    //getting the admin
    var admins = req.found.firstname;

    if (admins) {
        groupAdmin.deleteAdmin(admins).then((admin) => {
            res.redirect('back');
        }).catch((e) => {
            res.redirect('back');
        });
    }else{
        res.redirect('back');
    }
});

//blocking members in the group
router.get('/block/:id', auth.authenticate, auth.finduser, function(req, res, next){
    var member = req.found.firstname;
    var status = 'blocked';

    if (member) {
        groupMember.updateMember(member, status).then((members) =>{
            res.redirect('back');
        }).catch((e) => {
            res.redirect('back');
        });
    }
});

//unblocking members in the group
router.get('/unblock/:id', auth.authenticate, auth.finduser, function(req, res, next) {
    var member = req.found.firstname;
    var status = 'active';

    if (member) {
        groupMember.updateMember(member, status).then((members) => {
            res.redirect('back');
        }).catch((e) => {
            res.redirect('back');
        });
    }
});

//sharing group post to user timeline
router.post('/shareGroupPost', auth.authenticate, function(req, res, next) {
    var userid = req.body.author;
    var postType = req.body.obj;
    var main = req.body.main;

    var shareObj = new share({ author: userid, shareObj: postType, shareObjId: main });

    if (req.body.share) {
        share.create(shareObj).then(() => { res.redirect('back') }).catch((e) => { res.status(404).send(e) });
    }else{
        return res.status(404).redirect('back');
    }
});

//adding a post in a group route function
router.post('/groupPost', auth.authenticate, function(req, res, next) {
    var gname = req.body.gname;
    req.body.postcontent = { text: req.body.postcontent, fontsize: texts.format(`${req.body.postcontent}`) };;
    req.body.creator = req.user.id;

    if (!ObjectID.isValid(req.user.id)) {
        return res.status(404).send();
    }

    var files1 = uploads.uploadFile(req.files.image);
    var posts = new post({ postContent: req.body.postContent, postMedia: files1, author: req.user.id, mainObj: gname});

    // check the filetype before uploading it
    if (req.files.image.mimetype === 'image/png' || req.files.image.mimetype === 'image/jpeg' || req.files.image.mimetype === 'image/gif' || req.files.image.mimetype === 'image/mp4') {
        // upload the file to the /public/assets/img directory
        req.files.image.mv(`public/group_post/${files1}`, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            post.create(posts).then((postcons) => { 
                var userid = req.user.id;
                var postType = postcons.postObj;
                var main = postcons.mainObj;

                var shareObj = new share({author: userid, shareObj: postType, shareObjId: main});

                if (req.body.share) {
                    share.create(shareObj).then(() =>{res.redirect('back')}).catch((e) =>{res.status(404).send(e)});
                }
                res.redirect('back');
            }).catch((e) => {
                res.status(404).send(e);
            });
        });

    } else {
        return 'file format not supported';
    }
});

//adding and creating groups in the platform
router.post('/addGroup', auth.authenticate, function(req, res, next){
    req.body.creator = req.InteriorUser._id;
    console.log('this should be working');
    if(!ObjectID.isValid(req.InteriorUser._id)) {
        return res.status(404).send();
    }

    if(!req.files){
        return res.status(400).send("No files were uploaded.");
    }
    file.scan(req.files.image, (err, file) => {
        
    if(err.status === true){  
        return res.send(err.message);    
    }
    var group_name = req.body.name;
    var group_des = req.body.group_des;
    var groupData = new group({groupName: group_name, groupLogo: file.filename, groupDes: group_des, creator: req.InteriorUser._id});

    file.move_to('group_logos');

    group.create(groupData).then(() => {

     res.redirect('back');

    }).catch((e) => {
         res.status(404).send(e) 
    });
        
    });
    
    
});


module.exports = router;