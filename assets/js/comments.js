$(function () {
    pollComments();
});

function pollComments() {
    $.ajax({
        type: "GET",
        url: "https://live.wmapi.net/v1/stream/" + getQueryVariable('stream') + '/comments/recent',
        data: {
            t: 3600,
            limit: 60,
            order: 'asc'
        },
        dataType: "json",
        success: function (response) {
            if (response.ret == 0) {
                new_dom = '';
                $.each(response.data, function (i, cmt) {
                    console.log(cmt);
                    new_dom += '<div class="row cmt"><div class="col">';
                    //new_dom += '<svg width=30 height=30 data-jdenticon-value="' + cmt.avatar + '">User</svg>';
                    new_dom += '<span class="user-name name-color ml-2 mr-2">' + cmt.name_safe + '</span>';
                    new_dom += '<span class="user-comment text-color">' + cmt.text_safe + '</span>';
                    new_dom += '</div></div>';
                });
                $('.comments').html(new_dom);
                //jdenticon();
            } else {
                console.log('Poll Error: (' + response.ret + ') ' + response.msg);
            }
        }
    });

    setTimeout(() => {
        pollComments();
    }, 1000);
}

