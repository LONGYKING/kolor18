var express = require('express');
var _ = require('lodash');
var post = require('../../models/postmodel');

//file that handles the api call for blogPost by blogers
var User = require('../../models/usermodel');

var blogPost = function(title, postContent, apiKey, blog){
    //making sure the url is not empty
    if (title == "" || postContent == "") {
        return res.send('invalid response');
    }
    //checking if the key is valid 
    if (apikey == "1234567") {
        postContent = { text: postContent, fontsize: texts.format(`${postContent}`) };

        //getting the post contents
        var posts = new post({ title: title, postContent: postContent, postObj: blog });
        //console.log(posts);

        //adding post to the blog
        post.create(posts).then((posts1) => {
            if (!posts1) {
                return res.send('Error');
            }
        });

    } else {
        res.send('key missing');
    }
}

module.exports = {blogPost};

