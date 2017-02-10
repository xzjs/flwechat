/**
 * Created by yanlli on 2017/1/24.
 */
$(function () {
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
            $('.publish_content').prepend('<input name="user_id" type="hidden" value=id>');
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
                        console.log(result.id);
                        console.log(result.topic);
                        $.cookie('article_id',result.id);
                        // $('#topic_class').val(result.topic);
                        $('#dialog2').fadeIn(200);
                        $('#sure2').on('click',function () {
                            $('#dialog2').fadeOut(200);
                        });
                    }
                }
            });
        }

    });
    // var $iosDialog1 = $('#iosDialog1');
    // $('#dialogs').on('click', '.weui-dialog__btn', function () {
    //     $(this).parents('.js_dialog').fadeOut(200);
    // });
    // $('#showIOSDialog1').on('click', function () {
    //     $iosDialog1.fadeIn(200);
    // });
});
