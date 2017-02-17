/**
 * Created by xzjs on 2017/2/16.
 */
var follow_type = 0;
function follow_user(obj) {
    $.post('/flwechat/public/follow',
        {'follow_user_id': user_id, 'be_follow_id': obj.data('id'), 'type': follow_type},
        function (result) {
            if (result > 0) {
                var $toast = $('#toast');

                if ($toast.css('display') != 'none') return;

                $toast.fadeIn(100);
                setTimeout(function () {
                    $toast.fadeOut(100);
                }, 2000);
                change_follow(0, obj);
            }
        }
    );
}

function cancel_follow_user(obj) {
    $.post('/flwechat/public/follow/cancel_follow',
        {'follow_user_id': user_id, 'be_follow_id': obj.data('id'), 'type': follow_type},
        function (result) {
            if (result == 'true') {
                change_follow(1, obj);
            }
        });
}

//设置关注按钮
function set_follow(type) {
    var html = '<div id="toast" style="display: none;">'
        + '<div class="weui-mask_transparent"></div>'
        + '<div class="weui-toast">'
        + '<i class="weui-icon-success-no-circle weui-icon_toast"></i>'
        + '<p class="weui-toast__content">已关注</p>'
        + '</div></div>';
    $('body').append(html);
    follow_type = type;
    $('.follow_action').each(function () {
        init($(this));
    });
}

//关注按钮初始化
function init(obj) {
    $.post('/flwechat/public/follow/get_follow_list',
        {'id': user_id, 'type': follow_type},
        function (result) {
            var flag = false;
            //TODO 当数据量大时，此处得切换为二分查找，时间复杂度从o(n)降为o(log(n))
            for (var i = 0; i < result.length; i++) {
                if (result[i].id == obj.data('id')) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                change_follow(0, obj);
            } else {
                change_follow(1, obj);
            }
        }, 'json');
}

//改变关注图标的状态
function change_follow(type, obj) {
    if (type == 0) {
        obj.attr('src', 'images/follow2.png');
        obj.on('click', function () {
            cancel_follow_user(obj);
        });
    } else {
        obj.attr('src', 'images/follow.png');
        obj.on('click', function () {
            follow_user(obj);
        });
    }
}