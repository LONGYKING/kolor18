const validator = require('validator');
const _ = require('lodash');
const mongoose = require('../config/config');

var apiSchema = new mongoose.Schema({
    owner: {},
    apiKey: {}
});

//getting the api key using the key
apiSchema.statics.getKey = function(keys){
    var key = this;

    return key.findByOne({apiKey: keys}).then((keys) => {
        return Promise.resolve(keys);
    });
}

//getting the apikey owner
apiSchema.statics.getKeyOwner = function(key){
    var key = this;

    return key.findByOne({apiKey: key}).then((owners) =>{
        return key.Promise.resolve(owners);
    });
}

var blog = mongoose.model('blog', apiSchema);

module.exports = blog;