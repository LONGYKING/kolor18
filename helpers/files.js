const min  = 10000;
const max  = 1000000;
const rand = Math.floor(Math.random() * (max - min + 1)) + min + Math.random();
const ext  = ['png', 'jpeg', 'jpg', 'gif', 'mp4'];
var err = {};
var res = {};
var file

var scan = function(src_image, callback){
    let image_name    = src_image.name;
    let fileExtension = src_image.mimetype.split('/')[1];
    image_name += rand + '.' + fileExtension;
    
    // checks filetype before uploading it
    if (in_array(ext, fileExtension)) {
        
        res.type = fileExtension == 'mp4' ? 'video' : 'image';
     
        res.filename = image_name,
        res.move_to  = function(path, file = `${image_name}`){
            src_image.mv(`public/images/${path}/${file}`, (err) => {
                if (err) {
                } else{
                    return this;
                }});
            }// upload the file to the /public/assets/img directory
    } else {
        err.status  = true;
        err.message = 'UnAuthorized File Type';
    }

    return callback(err, res);
}


var in_array = function(haystack, needle){
    for(const [key, value] of Object.entries(haystack)){
      if(needle === value){
        return true;
      }
    }
      

    return false;
}

module.exports = {scan};

