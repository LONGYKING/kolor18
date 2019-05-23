//files that handles the post function in the platform
var express  = require('express');
var _        = require('lodash');
var {post}   = require('../models/postmodel');
var apimodel = require('../models/blogApimodel');

var texts    = require('../helpers/text');
var auth     = require('../middleware/auth');
const { ObjectID } = require('mongodb');

var router = express.Router();

router.get('/api/:key/:title/:content',auth.verifykey, auth.watch_activity, function(req, res, next) {

    var title = req.params.title;
    var apikey = req.params.key;
    var postContent = req.params.content;
    var blog = 'blog';

    //making sure the url is not empty
    if (title == "" || postContent == "") {
        return res.send('invalid response');
    }
            //getting the owner of the post
            postContent = { text: postContent, fontsize: texts.format(`${postContent}`) };

            //getting the post contents
            var posts = new post({ title: title, postcontent: postContent,author:req.InteriorUser._id, postObj: blog, activity: req.body.activity});
            //console.log(posts);

            //adding post to the blog
            post.create(posts).then((posts1) => {
                if (!posts1) {
                    return res.send('Error');
                }
                return req.activity.getArgument(posts1._id).then((timeline) => {
                  res.send('hello');
                });
                
            });
    
});

module.exports = router;
