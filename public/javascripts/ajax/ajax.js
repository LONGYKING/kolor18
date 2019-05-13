function like(id){
    $.ajax({
        method: 'GET',
        url   : '/post/like/'+id
    }).done(function (data) {
        $('#'+id).html(data);
    }).fail(function (data) {
        alert("failed");
    })
}

function close_post(){
    $('#viewpost').html(''); 
}

function panel(timeline){
    $('#spinner-wrapper').show();
    $.ajax({
        method: 'GET',
        url   : '/post/panel/'+timeline
    }).done(function (data) {
        $('#viewpost').html(data);
    }).fail(function (data) {
        alert("failed");
    })
}

function friends(category){
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

function share_dialog(id){
    $.ajax({
        method: 'GET',
        url   : '/ajax/post/'+id
    }).done(function (data) {
        $('#viewpost').html(data);
    }).fail(function (data) {
        alert("failed");
    })

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


