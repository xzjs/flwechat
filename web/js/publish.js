/**
 * Created by yanlli on 2017/1/24.
 */
$(function () {
    var sum=0;
    $("#pic_files").change(function () {
        var picSrc = $(this).prop("files");
        var flag  = sum + picSrc.length;
        if(flag < 4)
        {
            for (var i = 0; i < picSrc.length; i++) {
                var url = window.URL.createObjectURL(picSrc[i]);
                $(".pic_insert").prepend("<img class='pic_insert_icon' src='" + url + "' alt=''>");
            }
            sum += i;
        }
        else
        {
            alert("最多上传3张图");
        }


    });
});