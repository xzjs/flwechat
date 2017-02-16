/**
 * Created by xzjs on 2017/2/16.
 */
function follow_user(follow_id) {
    $.post('/flwechat/public/follow',
        {'follow_user_id': user_id, 'be_follow_id': follow_id, 'type': 0},
        function (result) {
            if (result > 0) {
                var $toast = $('#toast');

                if ($toast.css('display') != 'none') return;

                $toast.fadeIn(100);
                setTimeout(function () {
                    $toast.fadeOut(100);
                }, 2000);
                change_follow(0, follow_id);
            }
        }
    );
}

function cancel_follow_user(follow_id) {
    $.post('/flwechat/public/follow/cancel_follow',
        {'follow_user_id': user_id, 'be_follow_id': follow_id, 'type': 0},
        function (result) {
            if (result == 'true') {
                change_follow(1, follow_id);
            }
        });
}

//设置关注按钮
function set_follow(follow_id) {
    var html = '<div id="toast" style="display: none;">'
        + '<div class="weui-mask_transparent"></div>'
        + '<div class="weui-toast">'
        + '<i class="weui-icon-success-no-circle weui-icon_toast"></i>'
        + '<p class="weui-toast__content">已关注</p>'
        + '</div></div>';
    $('body').append(html);
    init(follow_id);
}

//关注按钮初始化
function init(follow_id) {
    $.post('/flwechat/public/follow/get_follow_list',
        {'id': user_id, 'type': 0},
        function (result) {
            var flag = false;
            //TODO 当数据量大时，此处得切换为二分查找，时间复杂度从o(n)降为o(log(n))
            for (var i = 0; i < result.length; i++) {
                if (result[i].id == follow_id) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                change_follow(0,follow_id);
            } else {
                change_follow(1,follow_id);
            }
        }, 'json');
}

//改变关注图标的状态
function change_follow(type, follow_id) {
    if (type == 0) {
        $('#follow').attr('src', 'images/follow2.png');
        $('#follow').on('click', function () {
            cancel_follow_user(follow_id, user_id);
        });
    } else {
        $('#follow').attr('src', 'images/follow.png');
        $('#follow').on('click', function () {
            follow_user(follow_id, user_id);
        });
    }
}