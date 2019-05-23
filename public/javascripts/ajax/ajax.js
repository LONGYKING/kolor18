var form = document.getElementById('how_you_feel');
var req = new XMLHttpRequest();
req.upload.addEventListener('', function(e){
    alert('holla')
}, false);
form.addEventListener('submit', function(e) {
    e.preventDefault();
    var formData = new FormData(form);

    req.open('post', '/post', true);
    req.send(formData);
    req.onload = function() {
        alert(`Loaded: ${req.status} ${req.response}`);
        $('#submit').html('post');
      };
      
      req.onerror = function() { // only triggers if the request couldn't be made at all
        alert(`Network Error`);
      };
      
      req.onprogress = function(event) { // triggers periodically
        // event.loaded - how many bytes downloaded
        // event.lengthComputable = true if the server sent Content-Length header
        // event.total - total number of bytes (if lengthComputable)
        $('#submit').html(`Received ${event.loaded} of ${event.total}`);
      };
}, false);

function close_post(id){
    $('#'+id).attr('style', 'display: none;');
}

function discard(){
    $('#sharepost').hide();
}

var in_array = function(haystack, needle){
    for(const [key, value] of Object.entries(haystack)){
      if(needle === value){
        return true;
      }
    }
      

    return false;
}

var Load = ()  => {
    
    if(window.screen.availWidth > 1024){
        $.ajax({
            method: 'GET',
            url   : '/ajax/sides'
        }).done(function (data) {
            $('#sideoo').append(data);
        }).fail(function (data) {
            alert("Error loading sides");
        })
    }
}

var fragment = function (){
    
    this.downloads = Array();
    
};

fragment.prototype.like = function(id){
    $.ajax({

        method: 'GET',
        url   : '/post/like/'+id

    }).done(function (data) {

        $('#'+id).html(data);

    }).fail(function (data) {

        alert("failed");

    })
}

fragment.prototype.show_downloads = function(){
    alert(this.downloads);
}

fragment.prototype.panel = function(timeline,key){
    if(in_array(this.downloads, key)){
        $('#'+key).attr('style', 'display: block;background: rgba(0, 0, 0, 0.89);');
    } else {
    this.get_downloads(key);

    $('#spinner-wrapper').show();

    $.ajax({

        method: 'GET',
        url   : '/post/panel/'+timeline

    }).done(function (data) {

        $('#viewpost').append(data);

    }).fail(function (data) {

        alert("failed");
        
    })
}
}

fragment.prototype.get_downloads = function(key){

    this.downloads.push(key);
}

fragment.prototype.share_dialog = function(id){
    $.ajax({
        method: 'GET',
        url   : '/ajax/post/'+id
    }).done(function (data) {
        $('#sharepost').html(data);
    }).fail(function (data) {
        alert("failed");
    })

}

fragment.prototype.comment = function(id,avatar,firstname,lastname){
    var text = $("#"+id+"comment").val();
    var com = '<li style="" class="comment-item"><div class="post__author author vcard inline-items row"><img src="/images/users_profile_pictures/'+avatar+'" alt="author"><div class="author-date"><a class="h6 post__author-name fn" href="#">'+firstname +' '+ lastname+'</a><div class="post__date"><time class="published" datetime="">now</time></div></div><a href="#" class="more"><svg class="olymp-three-dots-icon"><use xlink:href="svg-icons/sprites/icons.svg#olymp-three-dots-icon"></use></svg></a></div><p style="font-size: 17px;">'+text+' <a id="posteric'+id+'" style="color: #9b06bb;">posting...</a></p><a href="#" class="post-add-icon inline-items"><svg class="olymp-heart-icon"><use xlink:href="svg-icons/sprites/icons.svg#olymp-heart-icon"></use></svg><span>0</span></a><a href="#" class="reply">Reply</a></li>';
    
    $('#comett'+id).append(com);
    $('#cometto'+id).append(com);
    $.ajax({
        method: 'POST',
        url   : '/post/comment_on/'+id,
        data  : {
            text : text
        }
    }).done(function (data) {
        
        $('#posteric'+id).hide();
    }).fail(function (data) {
        alert("failed");
    });
}

fragment.prototype.birthday = function(){
    
        $.ajax({
            method: 'GET',
            url   : '/users/birthday/'
        }).done(function (data) {
            $('#birthday').html(data);
        }).fail(function (data) {
            
        })
}

fragment.prototype.birthday = function(){
    
        $.ajax({
            method: 'GET',
            url   : '/group/all_group/'
        }).done(function (data) {
            $('#suggest').html(data);
        }).fail(function (data) {
            
        })
}

fragment.prototype.friends = function(category){
    var friends = '';
    $.ajax({
        method: 'GET',
        url   : '/users/friends'
    }).done(function (data) {
        for (const [key, value] of Object.entries(data)) {
    
            friends += '<option value="'+value.users._id+'">'+value.users.firstname+'</option>';
    
        }
            $('#lab').html(category);
            $('#sectoria').html(friends);
        }).fail(function (data) {
            alert("failed");
        })
    }
    
    
    
var client = new fragment();




