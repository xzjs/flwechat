/**
 * Created by yanlli on 2017/1/24.
 */
$(function () {
    var id = $.cookie('id');
    if (id == null) {
        window.location.href = '/flwechat/web/index.html';
    }
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
        var comment=$('#comment').val();
        var url=$('#url').val();
        if (id == null) {
            window.location.href = '/flwechat/web/index.html';
        }else if (comment==''||url==''){
            $('#dialog1').fadeIn(200);
            $('#sure1').click(function(){$('#dialog1').fadeOut(200)});
        }else{
            $('.publish_content').prepend('<input name="user_id" type="hidden" value='+id+'>');
            var formData=new FormData($('.publish_content')[0]);
            $.ajax({
                url:"/flwechat/public/article",
                type:"post",
                data:formData,
                processData: false,
                contentType: false,
                dataType:"json",
                success:function(result){
                    if (result!=0){
                        $.cookie('article_id',result.id);
                        var article_id=result.id;
                        $('#topic').val('#'+result.topic);
                        var topic=$('#topic_class').val();
                        $('#dialog2').fadeIn(200);
                        $('#sure2').on('click',function () {
                            $.post('/flwechat/public/article/add_topic',{article_id:article_id,name:topic,user_id:id},function (result) {
                                if (result=='true'){
                                    $('#dialog2').fadeOut(200);
                                    window.location.href='my_publish.html';
                                }
                            },'json');
                        });
                    }
                }
            });
        }

    });
});
