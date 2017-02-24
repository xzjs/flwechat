/**
 * Created by yanlli on 2017/1/24.
 */
$(function () {
    var article_id = 0;

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

    $("#showIOSDialog1").click(function () {
        var id = $.cookie('id');
        var comment = $.trim($('#comment').val());
        var topic_id=$('#topic_select').val();
        if(topic_id==0){
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
                            window.location.href = "article_detail.html?id=" + reply_id;
                        }else{
                            window.location.href = 'mine.html';
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
                $('#topic_select').attr('disabled','disabled');
            });
        }
    });
}

var reply_id=GetQueryString('id');
if (reply_id == null) {
    reply_id = 0;
}