/**
 * Created by yanlli on 2017/2/13.
 */
$(document).ready(function () {
    get_content();
});

function get_content() {
    $.post('/flwechat/public/follow/get_follow_list',
        {'id': user_id, 'type': 0},
        function (result) {
            var html = '';
            for (var i = 0; i < result.length; i++) {
                html += '<div class="user_list">'
                    + '<a href="mine.html?id=' + result[i].id + '">'
                    + '<img src="' + result[i].head_img + '" alt="" class="head_portrait"/>'
                    + '<div>'
                    + '<div class="user_name">' + result[i].nickname + '</div>'
                    + '<!--<p class="new_messages_num">5<span>条新状态</span></p>-->'
                    + '</div></a>'
                    + '<div class="follow_icon_box"><img class="follow_action" src="images/follow.png" alt="" id="follow_icon" data-id="'+result[i].id+'"></div> </div>';
            }
            $('#follow_list').html(html);
            set_follow(0);
        }, 'json');
}