/**
 * Created by xzjs on 2017/2/18.
 */
$(function () {
    load_friend();
});

function agree(id) {
    $.post('/flwechat/public/friend/agree_friend',
        {'friend_post': id, 'friend_receive': user_id},
        function (result) {
            if (result == 'true') {
                load_friend();
            }
        });
}

function load_friend() {
    $.post('/flwechat/public/friend/get_friends',
        {'id': user_id, 'type': 2},
        function (result) {
            var html = '';
            for (var i = 0; i < result.length; i++) {
                html += '<div class="contacts">'
                    + '<div class="accept" onclick="agree(' + result[i].id + ')">接收</div>'
                    + '<a href="mine.html?id=' + result[i].id + '">'
                    + '<img src="' + result[i].head_img + '" alt="" class="head_portrait" /></a>'
                    + '<div><div class="user_name">' + result[i].nickname + '</div>'
                    + '<p class="verification_messages">请求添加为好友</p></div></div>';
            }
            if (result.length == 0) {
                $('.contacts_blank').show();
            }
            $('#content').append(html);
        }, 'json');
}