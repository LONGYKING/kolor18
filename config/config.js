const mongoose   = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/rotten-potatoes', { useNewUrlParser : true}, (err) => {
    if(err){
        console.log(err);
    }
});

module.exports = mongoose;
