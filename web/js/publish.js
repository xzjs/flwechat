/**
 * Created by yanlli on 2017/1/24.
 */
$(function () {
    var id = $.cookie('id');
    var article_id = 0;

    if (id == null) {
        window.location.href = '/flwechat/web/index.html';
    }

    get_select_list();

    $("#pic_files1").change(function () {
        var url = window.URL.createObjectURL(this.files.item(0));
        $("#pic_insert_icon1").attr("src", url);
    });
    $("#pic_files2").change(function () {
        var url = window.URL.createObjectURL(this.files.item(0));
        $("#pic_insert_icon2").attr("src", url);
    });
    $("#pic_files3").change(function () {
        var url = window.URL.createObjectURL(this.files.item(0));
        $("#pic_insert_icon3").attr("src", url);
    });

    $('#sure2').on('click', function () {
        $.post('/flwechat/public/article/add_topic', {
            article_id: article_id,
            name: $('#topic').val(),
            user_id: id
        }, function (result) {
            if (result == 'true') {
                window.location.href = 'mine.html';
            }
        });
    });

    $("#showIOSDialog1").click(function () {
        var id = $.cookie('id');
        var comment = $('#comment').val();
        var url = $('#url').val();
        if (id == null) {
            window.location.href = '/flwechat/web/index.html';
        } else if (comment == ''||comment==null) {
            $('#dialog1').fadeIn(200);
            $('#sure1').click(function () {
                $('#dialog1').fadeOut(200)
            });
        } else {
            $('.publish_content').prepend('<input name="user_id" type="hidden" value=' + id + '>');
            var reply_id = GetQueryString('id');
            if (reply_id == null) {
                reply_id = 0;
            }
            var formData = new FormData($('.publish_content')[0]);
            formData.append('reply_id', reply_id);
            var article=null;
            if (reply_id != 0) {
                $.ajaxSettings.async = false;
                $.getJSON('/flwechat/public/article/' + reply_id, function (result) {
                    article = result;
                    formData.append('topic_id', result.topic.id);
                });
                $.ajaxSettings.async = true;
            }
            $.ajax({
                url: "/flwechat/public/article",
                type: "post",
                data: formData,
                processData: false,
                contentType: false,
                dataType: "json",
                success: function (result) {
                    if (result != 0) {
                        article_id = result.id;
                        if (reply_id != 0) {
                            window.location.href="article_detail.html?id="+reply_id;
                        } else {
                            $('#topic').val(result.topic);
                            $('#dialog2').fadeIn(200);
                        }
                    } else {
                        console.log(result);
                    }
                }
            });
        }
    });
});

function get_select_list() {
    $.getJSON('/flwechat/public/topic',function (result) {
        var html='';
        for(var i=0;i<result.length;i++){
            html+='<option value="'+result[i].id+'">'+result[i].content+'</option>'
        }
        $('#topic_select').append(html);
    })
}