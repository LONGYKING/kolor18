const mongoose   = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/k18', { useNewUrlParser : true}, (err) => {
    if(err){
        console.log(err);
    }
});

module.exports = mongoose;
