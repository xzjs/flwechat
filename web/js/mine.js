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
        $.post('/flwechat/public/follow/get_follow_list',
            {'id': user_id, 'type': 0},
            function (result) {
                var flag = false;
                //TODO 当数据量大时，此处得切换为二分查找，时间复杂度从o(n)降为o(log(n))
                for (var i = 0; i < result.length; i++) {
                    if (result[i].id == show_id) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    $('#img').attr('src', 'images/follow2.png');
                    $('#img').parent().attr('onclick', 'cancel_follow_user(' + show_id + ')');
                } else {
                    $('#img').attr('src', 'images/follow.png');
                    $('#img').parent().attr('onclick', 'follow_user(' + show_id + ')');
                }
            }, 'json');
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

function follow_user(be_follow_id) {
    $.post('/flwechat/public/follow',
        {'follow_user_id': user_id, 'be_follow_id': be_follow_id, 'type': 0},
        function (result) {
            if (result > 0) {
                var $toast = $('#toast');

                if ($toast.css('display') != 'none') return;

                $toast.fadeIn(100);
                setTimeout(function () {
                    $toast.fadeOut(100);
                }, 2000);
                $('#img').attr('src', 'images/follow2.png');
                $('#img').parent().attr('onclick', 'cancel_follow_user(' + show_id + ')');
            }
        }
    );
}

function cancel_follow_user(be_follow_id) {
    $.post('/flwechat/public/follow/cancel_follow',
        {'follow_user_id': user_id, 'be_follow_id': be_follow_id, 'type': 0},
        function (result) {
            if (result == 'true') {
                $('#img').attr('src', 'images/follow.png');
                $('#img').parent().attr('onclick', 'follow_user(' + show_id + ')');
            }
        });
}
