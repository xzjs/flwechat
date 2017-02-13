/**
 * Created by xzjs on 2017/2/8.
 */
$(document).ready(function () {
    var id = $.cookie('id');
    if (id == null) {
        window.location.href = '/flwechat/web/index.html';
    }
    $.getJSON('/flwechat/public/user/'+id, function (result) {
        $('.head_portrait')[0].src = result.head_img;
        $('.name').html(result.nickname);
    })
});
