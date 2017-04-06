/**
 * Created by yanlli on 2017/1/24.
 */

var formData = new FormData();
var reply_id = GetQueryString('reply_id');
if (reply_id == null) {
    reply_id = 0;
} else {
    $('title').html('评论');
}
var action = GetQueryString('action');
var canvas = $('#canvas')[0];
var show_img, signaturePad, url;
var w, h;

$(function () {
    var article_id = 0;
    get_select_list();
    edit();

    $(".container").height($(window).height() - 100);

    $("#pic_files1").change(function () {
        var file = this.files.item(0);
        EXIF.getData(file, function () {
            var Orientation = EXIF.getTag(this, "Orientation");
            console.log(Orientation);
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                $("#pic_file1").attr("src", this.result);
                set_canvas(this.result, Orientation);
            };
        });
        show_img = $("#pic_file1");
        // $('#pic_blank').css('display', 'none');
    });
    $("#pic_files2").change(function () {
        var file = this.files.item(0);
        EXIF.getData(file, function () {
            var Orientation = EXIF.getTag(this, "Orientation");
            console.log(Orientation);
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                $("#pic_file2").attr("src", this.result);
                set_canvas(this.result, Orientation);
            };
        });
        show_img = $("#pic_file2");
    });
    $("#pic_files3").change(function () {
        var file = this.files.item(0);
        EXIF.getData(file, function () {
            var Orientation = EXIF.getTag(this, "Orientation");
            console.log(Orientation);
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                $("#pic_file3").attr("src", this.result);
                set_canvas(this.result, Orientation);
            };
        });
        show_img = $("#pic_file3");
    });
    if (reply_id != 0) {
        $('.pic_sup').hide();
    } else {
        $('.pic_sup').css('display', 'inline');
    }
    $("#showIOSDialog1").click(function () {
        $(this).attr('disabled','disabled');
        $(this).html('正在提交，请稍后');
        var id = $.cookie('id');
        var comment = $.trim($('#comment').val());
        var topic_id = $('#topic_select').val();
        var pic_input = $('.pic_input').val();
        if (reply_id != 0) {
            if (comment == '' || topic_id == 0) {
                $('#dialog2').fadeIn(200);
                $('#sure2').click(function () {
                    $('#dialog2').fadeOut(200);
                    return;
                });
                return;
            }
        } else {
            if (comment == '' || topic_id == 0 || pic_input == '') {
                $('#dialog1').fadeIn(200);
                $('#sure1').click(function () {
                    $('#dialog1').fadeOut(200);
                    return;
                });
                return;
            }
        }

        formData.append('reply_id', reply_id);
        formData.append('topic_id', topic_id);
        formData.append('user_id', user_id);
        formData.append('comment', $('#comment').val());
        if ($('#checkbox').prop('checked')) {
            formData.append('is_public', 1);
        } else {
            formData.append('is_public', 0);
        }
        $.ajax({
            url: '/flwechat/public/article',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (result) {
                if (result == 'true') {
                    if (reply_id != 0) {
                        window.location.href = "article_detail.html?reply_id=" + reply_id;
                    } else {
                        if ($('#checkbox').prop('checked')) {
                            window.location.href = 'index.html';
                        } else {
                            window.location.href = 'mine.html';
                        }

                    }
                } else {
                    console.log(result);
                    alert('系统出故障了！！！');
                }
            }
        });

    });
    $('.weui-switch').change(function () {
        var flag = $('.weui-switch').prop('checked');
        if (flag == true) {
            $('#open_close').html('公开');
        } else {
            $('#open_close').html('仅自己可见');
        }
    });
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

//设置canvas的长宽
function set_canvas(img, Orientation) {
    $('#myModal').modal();
    var image = new Image();
    image.src = img;
    image.onload = function () {

        w = this.naturalWidth;
        h = this.naturalHeight;
        var expectWidth = 0, expectHeight = 0;
        var lookWidth = $(window).width() * 0.7;
        var lookHeight = $(window).height() * 0.7;

        if (this.naturalWidth > this.naturalHeight && this.naturalWidth > lookWidth) {
            expectWidth = lookWidth;
            expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
        } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > lookHeight) {
            expectHeight = lookHeight;
            expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
        }
        if (Orientation == 6) {
            var canvas1 = document.createElement("canvas");
            var ctx = canvas1.getContext("2d");
            var ratio = Math.max(window.devicePixelRatio || 1, 1);
            var height = expectHeight * ratio;
            var width = expectWidth * ratio;
            canvas1.width = height;
            canvas1.height = width;
            ctx.rotate(0.5 * Math.PI);
            ctx.drawImage(this, 0, -height, width, height);
            img = canvas1.toDataURL();
            canvas.width = expectHeight;
            canvas.height = expectWidth;
            $('#canvas').css('height', expectWidth);
            $('#canvas').css('width', expectHeight);
        } else {

            canvas.width = expectWidth;
            canvas.height = expectHeight;
            $('#canvas').css('height', expectHeight);
            $('#canvas').css('width', expectWidth);
        }

        //canvas.getContext("2d").scale(ratio, ratio);

        $('#canvas').css('background-image', 'url(' + img + ')');
        $('#canvas').css('background-size', "cover");

        signaturePad = new SignaturePad(canvas, {
            penColor: "rgb(229,43,28)"
        });
    };
}

function show() {
    // show_img.attr('src', signaturePad.toDataURL());
    console.log(signaturePad.toData());
    var positions = getMarkPosition(signaturePad.toData());
    signaturePad.clear();
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    var context = canvas.getContext('2d');

    context.strokeStyle = "red";
    context.strokeRect(positions.min_x, positions.min_y, (positions.max_x - positions.min_x), (positions.max_y - positions.min_y));
    positions.mark = canvas.toDataURL();
    console.log(positions);
    positions.max_x *= w / $('#canvas').width();
    positions.min_x *= w / $('#canvas').width();
    positions.max_y *= h / $('#canvas').height();
    positions.min_y *= h / $('#canvas').height();
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

    return positions;
}
