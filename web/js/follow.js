/**
 * Created by yanlli on 2017/2/13.
 */
$(document).ready(function () {
    var id = $.cookie('id');
    if (id == null) {
        window.location.href = '/flwechat/web/index.html';
    }
    $('.follow_class').click(function () {
        $(this).addClass('selected').siblings('.follow_class').removeClass('selected');
    });
    // $.getJSON('/flwechat/public/user/'+id, function (result) {
    //     $('#head_portrait')[0].src = result.head_img;
    //     $('#name').html(result.nickname);
    // })
});