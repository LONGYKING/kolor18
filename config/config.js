const mongoose   = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://okwarafrank:nHBOxulT54kxQvCE@cluster0-qd9wy.mongodb.net/test?retryWrites=true', { useNewUrlParser : true}, (err) => {
    if(err){
        console.log(err);
    }
});

module.exports = mongoose;
