function init() {
    $.ajax({
        type: "GET",
        url: "https://live.wmapi.net/v1/stream/" + getQueryVariable('stream'),
        data: {},
        dataType: "json",
        success: function (response) {
            if (response.ret == 0) {
                if (response.data.status != 'active') {
                    $('#err_title').text('Live Stream Ended');
                    $('#err_subtitle').text('You\'d better be earlier next time.');

                    $('#main').hide();
                    $('#err_div').show();
                } else {
                    // Update Info
                    document.title = response.data.title + ' | Live Stream by WooMai Labs';
                    $('#title').text(response.data.title);
                    $('#streamer').text(response.data.streamer);
                    setTimeout(() => {
                        checkStatus();
                    }, 8000);

                    // Load Video
                    console.log('URL: ' + response.data.play_url);
                    const dp = new DPlayer({
                        container: document.getElementById('dplayer'),
                        live: true,
                        autoplay: true,
                        video: {
                            url: response.data.play_url
                        }
                    });

                    dp.on('error', function () {
                        tata.error('Failed to load video', 'Please try to refresh the page.', { duration: 5000 });
                    });

                    // Boot Live Chat
                    // send comment
                    $('#msg').keydown(function (e) {
                        if (e.keyCode == 13) {
                            $('#send').click();
                        }
                    });

                    $('#send').click(function () {
                        $('#send').attr('disabled', 'disabled');
                        $('#send').text('Wait');

                        msg = $('#msg').val();
                        $('#msg').val('');
                        $.ajax({
                            type: "POST",
                            url: "https://live.wmapi.net/v1/stream/" + getQueryVariable('stream') + '/comment',
                            data: {
                                comment: msg
                            },
                            dataType: "json",
                            xhrFields: {
                                withCredentials: true
                            },
                            success: function (response) {
                                if (response.ret == 0) {
                                    updateComments(true);
                                    setTimeout(() => {
                                        $('#send').removeAttr('disabled');
                                        $('#send').text('Send');
                                    }, 1000);
                                } else {
                                    tata.warn('Failed', response.msg);
                                    $('#send').removeAttr('disabled');
                                    $('#send').text('Send');
                                }
                            },
                            error: function () {
                                tata.error('Error', 'Failed to send comment. Please try again');
                                $('#send').removeAttr('disabled');
                                $('#send').text('Send');
                            }
                        });
                    });

                    // update comments
                    $(window).resize(function () {
                        chgLivechatHeight();
                    });

                    updateComments();
                }
            } else if (response.ret == 7) {
                $('#err_title').text('Invalid Stream');
                $('#err_subtitle').text('Make sure your link is correct.');

                $('#main').remove();
                $('#err_div').show();
            } else if (response.ret == 5) {
                $('#err_title').text('Service Unavailable');
                $('#err_subtitle').html('An internal error occurred. Would you like to check our <a href="https://status.wmlabs.net" target="_blank">status page</a>?');

                $('#main').remove();
                $('#err_div').show();
            } else {
                $('#err_title').text('API Error');
                $('#err_subtitle').text('Code: ' + response.ret + ', ' + response.msg);

                $('#main').remove();
                $('#err_div').show();
            }
        },
        error: function () {
            $('#err_title').text('Request Error');
            $('#err_subtitle').html('Failed to fetch live stream\'s metadata. Would you like to check our <a href="https://status.wmlabs.net" target="_blank">status page</a>?');

            $('#main').remove();
            $('#err_div').show();
        }
    });
}

function chgLivechatHeight() {
    $('#comments').css('height', $('#chat').height() - $('#sendmsg').height() - 38);

    player_height = $('#dplayer').height();
    window_width = $(window).width();
    if (window_width >= 1300) {  // 1 row
        $('#chat').css('max-height', player_height);
    } else {  // 2 rows
        $('#chat').css('max-height', 400);
    }
}

var start_time = Math.floor(new Date().getTime() / 1000) - 60;
var start_id = 0;
function updateComments(single = false) {
    // 采用业界丢人的后端返回 DOM
    // 别问 问就是 JS 苦手
    $.ajax({
        type: "GET",
        url: "https://live.wmapi.net/v1/stream/" + getQueryVariable('stream') + '/comments/dom',
        data: {},
        dataType: "text",
        success: function (response) {
            $('#comments').html(response);

            setTimeout(() => {
                chgLivechatHeight();
                $('#comments').scrollTop(1145141919810);
            }, 300);

            if (!single) {
                setTimeout(() => {
                    updateComments();
                }, 1500);
            }
        },
        error: function () {
            tata.error('Failed to load live chat', response.msg, {
                animate: 'side'
            });

            if (!single) {
                setTimeout(() => {
                    updateComments();
                }, 4000);
            }
        },
        complete: function (XHR, TS) { XHR = null }
    });
}

function checkStatus() {
    $.ajax({
        type: "GET",
        url: "https://live.wmapi.net/v1/stream/" + getQueryVariable('stream'),
        data: {},
        dataType: "json",
        success: function (response) {
            if (response.ret == 0) {
                if (response.data.status == 'active') {
                    document.title = response.data.title + ' | Live Stream by WooMai Labs';
                    $('#title').text(response.data.title);
                } else if (response.data.status == 'ended') {
                    if (!Swal.isVisible()) {
                        Swal.fire({
                            icon: 'info',
                            title: 'Info',
                            text: 'Live Stream Ended',
                            allowOutsideClick: false
                        }).then(function () {
                            window.location.reload();
                        });

                        setTimeout(() => {
                            window.location.reload();
                        }, 30000)
                    }
                }

                setTimeout(() => {
                    checkStatus();
                }, 8000);
            } else {
                tata.error('Error', 'Failed to fetch live info', {
                    duration: 2000
                });
            }
        },
        complete: function (XHR, TS) { XHR = null }
    });
}

// boot
$(function () {
    init();

    $('#copy_url').attr('data-clipboard-text', window.location.href);

    var cp_url = new ClipboardJS('.copy-url');
    cp_url.on('success', function (e) {
        tata.success('Success', 'Link Copied!');
    });

    var cp = new ClipboardJS('.cp');
    cp.on('success', function (e) {
        tata.success('Success', 'Copied!');
    });
});
