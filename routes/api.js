//files that handles the post function in the platform
var express  = require('express');
var _        = require('lodash');
var {post}   = require('../models/postmodel');
var apimodel = require('../models/blogApimodel');

var texts    = require('../helpers/text');
var auth     = require('../middleware/auth.js');
const { ObjectID } = require('mongodb');

var router = express.Router();

router.get('/api/:key/:title/:content', auth.watch_activity, function(req, res, next) {

    var title = req.params.title;
    var apikey = req.params.key;
    var postContent = req.params.content;
    var blog = 'Blog';

    //making sure the url is not empty
    if (title == "" || postContent == "") {
        return res.send('invalid response');
    }
    //checking if the key is valid 
    apimodel.getKey(apikey).then((key) => {
        if (key) {
            //getting the owner of the post
            var owner = key.owner;
            postContent = { text: postContent, fontsize: texts.format(`${postContent}`) };

            //getting the post contents
            var posts = new post({ title: title, postContent: postContent,author:owner, postObj: blog });
            //console.log(posts);

            //adding post to the blog
            post.create(posts).then((posts1) => {
                if (!posts1) {
                    return res.send('Error');
                }
                return req.activity.getArgument(post._id).then((timeline) => {
                  res.redirect('back');
                });
                
            });

        } else {
            res.send('key missing');
        }
    });
    
});

module.exports = router;