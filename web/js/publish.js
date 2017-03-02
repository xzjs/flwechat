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
        //$("#pic_file1").attr("src", url);
    });
    $("#pic_files2").change(function () {
        url = window.URL.createObjectURL(this.files.item(0));
        set_canvas(url);
        show_img = $("#pic_file2");
        $('#pic_blank').css('display', 'none');
        //$("#pic_file2").attr("src", url);
    });
    $("#pic_files3").change(function () {
        url = window.URL.createObjectURL(this.files.item(0));
        set_canvas(url);
        show_img = $("#pic_file3");
        $('#pic_blank').css('display', 'none');
        // $("#pic_file2").attr("src", url);
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
            $('.publish_content').prepend('<input name="user_id" type="hidden" value=' + id + '>');

            var formData = new FormData($('.publish_content')[0]);
            formData.append('reply_id', reply_id);
            formData.append('topic_id', topic_id);
            if (action != null) {
                formData.append('id', reply_id);
            }
            // $.ajax({
            //     url: "/flwechat/public/article",
            //     type: "post",
            //     data: formData,
            //     processData: false,
            //     contentType: false,
            //     dataType: "json",
            //     success: function (result) {
            //         if (result == true) {
            //             if (reply_id != 0) {
            //                 window.location.href = "article_detail.html?id=" + reply_id;
            //             } else {
            //                 window.location.href = 'mine.html';
            //             }
            //         } else {
            //             console.log(result);
            //             alert('系统出故障了！！！');
            //         }
            //     }
            // });
            var data = {
                'user_id': user_id,
                'reply_id': reply_id,
                'topic_id': topic_id,
                'comment': $('#comment').val()
            }
            $('.pic_preview').each(function () {
                if ($(this).attr('src') != 'images/pic_insert.png') {
                    data[$(this).attr('id')] = $(this).attr('src');
                }
            });
            $.post('/flwechat/public/article', data, function (result) {
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
            });
        }
    });

    edit();
});

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

var reply_id = GetQueryString('id');
if (reply_id == null) {
    reply_id = 0;
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
            canvas.height = brower_height * 0.9;
            canvas.width = canvas.height / image_scale;
        } else {//宽大于长
            canvas.width = brower_width * 0.7;
            canvas.height = canvas.width * image_scale;
        }
        canvas.getContext("2d");
        console.log(canvas.height);
        console.log(canvas.width);
        signaturePad = new SignaturePad(canvas, {
            penColor: "rgb(229,43,28)"
        });
        signaturePad.fromDataURL(url);
        $('#myModal').modal();
    };
}

function show() {
    show_img.attr('src', signaturePad.toDataURL())
}

$('#clear').on('click', function () {
    signaturePad.clear();
    signaturePad.fromDataURL(url);
});
