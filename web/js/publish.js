/**
 * Created by yanlli on 2017/1/24.
 */
$(function () {
    var article_id = 0;

    get_select_list();

    $("#pic_files1").change(function () {
        url = window.URL.createObjectURL(this.files.item(0));
        set_canvas(url);
        show_img = $("#pic_file1");
        $('#pic_blank').css('display', 'none');
        $("#pic_file1").attr("src", url);
    });
    $("#pic_files2").change(function () {
        url = window.URL.createObjectURL(this.files.item(0));
        set_canvas(url);
        show_img = $("#pic_file2");
        $('#pic_blank').css('display', 'none');
        $("#pic_file2").attr("src", url);
    });
    $("#pic_files3").change(function () {
        url = window.URL.createObjectURL(this.files.item(0));
        set_canvas(url);
        show_img = $("#pic_file3");
        $('#pic_blank').css('display', 'none');
        $("#pic_file2").attr("src", url);
    });

    $("#showIOSDialog1").click(function () {
        var id = $.cookie('id');
        var comment = $.trim($('#comment').val());
        var topic_id = $('#topic_select').val();
        if (topic_id == 0) {
            alert('请选择话题');
            return;
        }
        if (comment == '') {
            $('#dialog1').fadeIn(200);
            $('#sure1').click(function () {
                $('#dialog1').fadeOut(200)
            });
        } else {
            // $('.publish_content').prepend('<input name="user_id" type="hidden" value=' + id + '>');

            // var formData = new FormData($('.publish_content')[0]);
            formData.append('reply_id', reply_id);
            formData.append('topic_id', topic_id);
            formData.append('user_id', user_id);
            formData.append('comment', $('#comment').val());
            // data.user_id = user_id;
            // data.reply_id = reply_id;
            // data.topic_id = topic_id;
            // data.comment = $('#comment').val();
            // $('.pic_preview').each(function () {
            //     if ($(this).attr('src') != 'images/pic_insert.png') {
            //         data[$(this).attr('id')] = $(this).attr('src');
            //     }
            // });
            // $.post('/flwechat/public/article', data, function (result) {
            //     if (result == 'true') {
            //         if (reply_id != 0) {
            //             window.location.href = "article_detail.html?id=" + reply_id;
            //         } else {
            //             window.location.href = 'mine.html';
            //         }
            //     } else {
            //         console.log(result);
            //         alert('系统出故障了！！！');
            //     }
            // });
            $.ajax({
                url: '/flwechat/public/article',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (result) {
                    if (result == 'true') {
                        if (reply_id != 0) {
                            window.location.href = "article_detail.html?id=" + reply_id;
                        } else {
                            window.location.href = 'mine.html';
                        }
                    } else {
                        console.log(result);
                        alert('系统出故障了！！！');
                    }
                }
            });
        }
    });

    edit();
});

var formData = new FormData();

function get_select_list() {
    $.getJSON('/flwechat/public/topic', function (result) {
        var html = '';
        for (var i = 0; i < result.length; i++) {
            html += '<option value="' + result[i].id + '">' + result[i].content + '</option>'
        }
        $('#topic_select').append(html);
        if (reply_id != 0) {
            $.getJSON('/flwechat/public/article/' + reply_id, function (result) {
                var article = result;
                $('#topic_select').val(article.topic_id);
                if (action == null) {
                    $('#topic_select').attr('disabled', 'disabled');
                }
            });
        }
    });
}

var reply_id = GetQueryString('reply_id');
if (reply_id == null) {
    reply_id = 0;
} else {
    $('title').html('评论');
}
var action = GetQueryString('action');

function edit() {

    if (action == 'edit') {
        $.getJSON('/flwechat/public/article/' + reply_id, function (result) {
            $('#comment').val(result.content);
            for (var i = 0; i < result.images.length; i++) {
                $('#' + result.images[i].position).attr('src', '/flwechat/public/storage/' + result.images[i].img);
            }
        });
    }
}

var canvas = $('#canvas')[0];
var show_img, signaturePad, url;

//设置canvas的长宽
function set_canvas() {
    $('#myModal').modal();
    var image = new Image();
    image.src = url;
    image.onload = function () {
        var w = image.width;
        var h = image.height;
        var brower_width = $(window).width();
        var brower_height = $(window).height();
        var image_scale = h / w;
        var brower_scale = brower_height / brower_width;
        var ratio = Math.max(window.devicePixelRatio || 1, 1);
        //如果长大于宽
        if (image_scale > brower_scale) {
            canvas.height = brower_height * 0.7 * ratio;
            canvas.width = canvas.height / image_scale;
        } else {//宽大于长
            canvas.width = brower_width * 0.7 * ratio;
            canvas.height = canvas.width * image_scale;
        }
        canvas.getContext("2d").scale(ratio, ratio);
        console.log(canvas.height);
        console.log(canvas.width);
        console.log(canvas.offsetHeight);
        console.log(canvas.offsetWidth);
        signaturePad = new SignaturePad(canvas, {
            penColor: "rgba(229,43,28,0.25)"
        });
        //signaturePad.fromDataURL(url);
        $('#canvas').css('height', canvas.height / ratio);
        $('#canvas').css('width', canvas.width / ratio);
        $('#canvas').css('background-image', "url(" + url + ")");
        $('#canvas').css('background-size', "cover");
    };
}

function show() {
    // show_img.attr('src', signaturePad.toDataURL());
    console.log(signaturePad.toData());
    var positions = getMarkPosition(signaturePad.toData());
    positions.mark = signaturePad.toDataURL();
    console.log(positions);
    formData.append(show_img.attr('id'), JSON.stringify(positions));
    formData.append(show_img.attr('id') + 'file', $("[name=" + show_img.attr('id') + "]")[0].files[0]);
}

$('#clear').on('click', function () {
    signaturePad.clear();
    // signaturePad.fromDataURL(url);
});

function resizeCanvas() {
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);

}

// window.onresize = resizeCanvas;
// resizeCanvas();

function getMarkPosition(arr) {
    var positions = {'max_x': arr[0][0].x, 'min_x': arr[0][0].x, 'max_y': arr[0][0].y, 'min_y': arr[0][0].y};
    for (var i = 0; i < arr.length; i++) {
        for (var j = 1; j < arr[i].length; j++) {
            positions.max_x = Math.max(positions.max_x, arr[i][j].x);
            positions.min_x = Math.max(Math.min(positions.min_x, arr[i][j].x), 0);
            positions.max_y = Math.max(positions.max_y, arr[i][j].y);
            positions.min_y = Math.max(Math.min(positions.min_y, arr[i][j].y), 0);
        }
    }
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    positions.max_x*=ratio;
    positions.min_x*=ratio;
    positions.max_y*=ratio;
    positions.min_y*=ratio;
    return positions;
}
