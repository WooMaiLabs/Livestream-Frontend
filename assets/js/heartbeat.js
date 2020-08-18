hb();

function hb() {
    setTimeout(hb, 4500);

    stream = getQueryVariable('stream');

    $.ajax({
        type: "POST",
        url: "https://live.wmapi.net/v1/stream/" + stream + "/heartbeat",
        dataType: "json",
        success: function (response) {
            if (response.ret == 0) {
                $('#viewers').text('Viewers: ' + response.data.viewers);
            }
        }
    });
}
