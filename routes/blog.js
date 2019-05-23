//import { Module } from 'module';
var express = require('express');
var _       = require('lodash');
const mailer   = require('nodemailer');
var router  = express.Router();

var {user}    = require('../models/usermodel');
var {post}  = require('../models/postmodel');
var {findByInterest}   = require('../models/activitymodel');
var auth    = require('../middleware/auth');
var alt     = require('../models/AlternateModel');
var {GetFriendRequests} = require('../models/RelationModel');;

var router = express.Router();

//getting the blog page
router.get('/blog',auth.authenticate, function(req, res, next) {

    findByInterest(req.InteriorUser._id, "blog").then((Feeds) => {
        
        Interior   = req.InteriorUser;
        
          res.render('blog',{
            Interior,Feeds,
          });
        }).catch((e) => {
          res.send(e);
        });
});

// //liking the posts in the blog page
// router.get('/likes/:id/:owner',auth.authenticate,function(req, res, next){
    
//     //getting the id of the post
//     var ids = req.params.id;
//     //getting the post owner
//     var owner = req.params.owner;
//     //getting the current user in the system
//     var user = req.user.firstname;

//     //adding the likes
//     //checking if the current has liked the post already
//     like.getLikesbyUser(user, ids).then((likes) => {
//         //checking if the user has like the post already
//         if (!likes) {
//             //getting the full details to be inserted
//             var likeObj = new like({ by: user, mainOwner: owner, mainObj: ids });
//             like.create(likeObj).then((getLikes) => {
//                 console.log(likeObj);
//                 if(getLikes){
//                     res.redirect('back');
//                 }else{
//                     res.redirect('back');
//                 }
//                 //cb(err, getLikes);
//             });
//         }else{
//             res.redirect('back');
//         }

//     });

//   // res.render('groups');
// });

// //searching the blog post in the blog page
// router.post('/search',auth.authenticate, function(req, res, next){
//     var searchKey = req.body.blog_search;
//     var blog = "Blog";

//     //console.log(searchKey);
//     if(searchKey == ""){
//         return res.send("Enter A Search Key");
//     }
//     post.searchBlogPost(searchKey, blog).then((posts) => {
//         Newuser.posts = posts;
//         //console.log(posts);
//         //Newuser = req.user.toJSON();

//         res.render('blog_result', Newuser);
//     });
// });

// //viewing more infromation about the blog post in the blog page
// router.get('/more/:blog_id',auth.authenticate,function(req, res, next) {

//     var id = req.params.blog_id;
//     var blog = "Blog";

//     //console.log(id);
//     post.findPostByObjs(blog,id).then((blogs) => {
//         post.searchBlogById(id,blog).then((post) => {
//             console.log(post);
//             Newuser = req.user.toJSON();
//             Newuser.blogs = post;
//             Newuser.blogPost = blogs;
//             res.render('view_blog', Newuser);
//         });
//     });


// });

module.exports = router;
