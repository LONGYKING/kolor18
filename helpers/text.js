var format = function(text){
    var font;
    if(text.length < 80){
        font = '20px';
    } else {
        font = '15px';
    }

    return font;
}

module.exports = {format};

