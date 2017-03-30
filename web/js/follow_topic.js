/**
 * Created by xzjs on 2017/2/17.
 */
$(document).ready(function () {
    get_content();

});

function get_content() {
    $.post('/flwechat/public/follow/get_follow_list',
        {'id': user_id, 'type': 1},
        function (result) {
            var html = '';
            for (var i = 0; i < result.length; i++) {
                html += '<div class="topic_list">'
                    + '<div class="head_portrait_box">'
                    + '<img src="images/topic.png" alt="" class="head_portrait"/>'
                    +'</div>'
                    + '<div class="follow_icon_box"><img class="follow_action" src="images/follow3.png" alt="" id="follow_icon" data-id="'+result[i].id+'"></div>'
                    + '<a href="index.html?reply_id=' + result[i].id + '">'
                    + '<div class="user_name">' + result[i].content + '</div>'
                    + '<!--<p class="new_messages_num">5<span>条新状态</span></p>-->'
                    + '</a>'
                    +'</div>';
            }
            $('#follow_list').html(html);
            set_follow(1);
            if ($('#follow_list').html()==''){
                $('.blank').css('display','block');
            }else{
                $('.blank').css('display','none');
            }
        }, 'json');
}