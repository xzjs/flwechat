/**
 * Created by xzjs on 2017/2/8.
 */
$(document).ready(function () {
    var id = 0;

    var show_id = GetQueryString('id');
    if (show_id != null) {
        id = show_id;
        set_follow(id);
        set_friend(0, show_id);
    } else {
        id = user_id;
        set_friend(1);
    }
    $.getJSON('/flwechat/public/user/' + id, function (result) {
        $('#head_img')[0].src = result.head_img;
        $('.name').html(result.nickname);
        $('title').html(result.nickname);
    });
    getArticleList('/flwechat/public/article/get_article_by_user_id/' + id);
    $('.messages span').click(function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        var html = $(this).html();
        var url = '';
        if (html == '发布的文章') {
            url = '/flwechat/public/article/get_article_by_user_id/' + id;
        } else {
            url = '/flwechat/public/article/comment_articles/' + id;
        }
        getArticleList(url);
    });
});

function set_friend(type, show_id) {
    if (type == 0) {
        var html = '<div id="friend_toast" style="display: none;">'
            + '<div class="weui-mask_transparent"></div>'
            + '<div class="weui-toast">'
            + '<i class="weui-icon-success-no-circle weui-icon_toast"></i>'
            + '<p class="weui-toast__content">已发送好友邀请</p>'
            + '</div></div>';
        $('body').append(html);
        $('#friend').on('click', function () {
            $.post('/flwechat/public/friend',
                {'friend_post_id': user_id, 'friend_receive_id': show_id},
                function (result) {
                    if (result == 'true') {
                        var $toast = $('#friend_toast');

                        if ($toast.css('display') != 'none') return;

                        $toast.fadeIn(100);
                        setTimeout(function () {
                            $toast.fadeOut(100);
                        }, 2000);
                    }
                })
        });
    } else {
        $('#friend').on('click', function () {
            window.location.href = 'friend_add_message.html';
        })
    }
}
