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
                    + '<a class="follow_user" href="mine.html?user_id=' + result[i].id + '">'
                    + '<img src="' + result[i].head_img + '" alt="" class="head_portrait"/>'
                    + '<span class="user_name">' + result[i].nickname + '</span>'
                    + '<!--<p class="new_messages_num">5<span>条新状态</span></p>-->'
                    + '</a>'
                    + '<div class="follow_icon_box"><img class="follow_action" src="images/follow2.png" alt="" id="follow_icon" data-id="'+result[i].id+'"></div></div>';
            }
            $('#follow_list').append(html);
            if ($('#follow_list').html()==''){
                $('.blank').css('display','block');
            }else{
                $('.blank').css('display','none');
            }
            set_follow(0);
        }, 'json');
}