//import { Module } from 'module';
var express = require('express');
var _ = require('lodash');
var auth = require('../middleware/auth.js');
var groupAuth = require('../middleware/groupAuth.js');
var user = require('../models/usermodel');
var group = require('../models/groupmodel');
var groupMember = require('../models/groupmember');
var like = require('../models/likemodel');
var share = require('../models/sharemodel');
var post = require('../models/postmodel');
var request = require('../models/requestmodel');
var groupAdmin = require('../models/groupAdminmodel');
var uploads = require('../helpers/uploads');
var texts = require('../helpers/text');
var feeds = require('../helpers/feedsFunc');
var api = require('../helpers/apis/blogapi');
const { ObjectID } = require('mongodb');

var router = express.Router();

//getting the blog page
router.get('/blog',auth.authenticate, function(req, res, next) {
    //getting the blog posts
    var arg = "Blog";
    post.findByObj(arg).then((posts) => {
        Object.keys(posts).forEach(function(prop){
            var blog_id = posts[prop]._id;
            var owner = posts[prop].author;
            //console.log(owner);
            //getting the like for each blog post
            like.getLikes(blog_id).then((likes) => {
                Newuser.likes = likes.length;
                Newuser.author = owner;
                Newuser = req.user.toJSON();
                Newuser.posts = posts;
                res.render('blog', Newuser);
            });
           
        });
        //console.log(alls);
        
    });
});

//liking the posts in the blog page
router.get('/likes/:id/:owner',auth.authenticate,function(req, res, next){
    
    //getting the id of the post
    var ids = req.params.id;
    //getting the post owner
    var owner = req.params.owner;
    //getting the current user in the system
    var user = req.user.firstname;

    //adding the likes
    //checking if the current has liked the post already
    like.getLikesbyUser(user, ids).then((likes) => {
        //checking if the user has like the post already
        if (!likes) {
            //getting the full details to be inserted
            var likeObj = new like({ by: user, mainOwner: owner, mainObj: ids });
            like.create(likeObj).then((getLikes) => {
                console.log(likeObj);
                if(getLikes){
                    res.redirect('back');
                }else{
                    res.redirect('back');
                }
                //cb(err, getLikes);
            });
        }else{
            res.redirect('back');
        }

    });

  // res.render('groups');
});

module.exports = router;
