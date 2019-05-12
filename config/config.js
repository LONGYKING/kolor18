const mongoose   = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/k18', { useNewUrlParser : true}, (err) => {
    if(err){
        console.log(err);
    }
});

module.exports = mongoose;