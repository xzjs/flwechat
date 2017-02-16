/**
 * Created by xzjs on 2017/2/8.
 */
$(document).ready(function () {
    var id = 0;
    if (user_id == null) {
        window.location.href = '/flwechat/web/index.html';
    }
    var show_id = $.cookie('show_id');
    if (show_id != null) {
        id = show_id;
        // $.removeCookie('show_id');

    } else {
        id = user_id;
    }
    $.getJSON('/flwechat/public/user/' + id, function (result) {
        $('#head_img')[0].src = result.head_img;
        $('.name').html(result.nickname);
    });
    getArticleList('/flwechat/public/article/get_article_by_user_id/' + id);
    $('.messages span').click(function () {
        $(this).addClass('selected').siblings().removeClass('selected');
    })
});
