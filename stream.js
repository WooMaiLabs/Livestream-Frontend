$(function () {
    init();
});

function init() {
    stream = getQueryVariable('stream');
    if (stream != false) {
        $.ajax({
            url: 'https://live.wmapi.net/v1/info/stream/' + stream,
            dataType: 'json',
            success: function (result) {
                console.log(result);
                if (result.ret != 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops!',
                        text: result.msg
                    });
                    OSPF();
                } else {
                    if (result.data.status == 'ended') {
                        Swal.fire({
                            icon: 'info',
                            title: '来晚了',
                            text: '该直播已结束'
                        });
                        OSPF();
                    } else {
                        if (result.data.title != null) {
                            $('#title').text(result.data.title);
                        }
                        $('#subtitle').text('Streamer: ' + result.data.streamer);

                        url = result.data.play_url;
                        mirror = getQueryVariable('mirror');
                        if (mirror != false && isEndpoint(mirror)) {
                            url = mirror + getQueryVariable('stream') + '.m3u8';
                        }

                        const dp = new DPlayer({
                            container: document.getElementById('dplayer'),
                            live: true,
                            autoplay: true,
                            video: {
                                url: url
                            }
                        });
                    }
                }
            },
            complete: function (XHR, TS) { XHR = null }
        });
    } else {
        OSPF();
    }
}


function OSPF() {
    const dp = new DPlayer({
        container: document.getElementById('dplayer'),
        live: true,
        autoplay: true,
        video: {
            url: 'OSPF.mp4'
        }
    });
}
