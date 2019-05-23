var express = require('express');
var _ = require('lodash');

var getauthor = function(obj){
    console.log(obj.ExteriorUser);
    if(obj.ExteriorUser._id != undefined){
        return obj.ExteriorUser._id
    } else {
        return obj.InteriorUser._id;
    }
}

module.exports = {getauthor};

