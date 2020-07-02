hb();

function hb() {
    setTimeout(hb, 20000);

    stream = getQueryVariable('stream');

    $.ajax({
        type: "POST",
        url: "https://live.wmapi.net/v1/info/stream/" + stream + "/heartbeat",
        dataType: "json",
        success: function (response) {
            if (response.ret == 0) {
                $('#viewers').text('Viewers: ' + result.data.viewers);
            }
        }
    });
}
