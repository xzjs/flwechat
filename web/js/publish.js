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
wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
    }
});