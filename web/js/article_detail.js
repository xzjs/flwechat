/**
 * Created by yanlli on 2017/2/14.
 */
$(function () {
    var article_id = GetQueryString('id');
    $.getJSON('/flwechat/public/article/' + article_id, function (result) {
        $('#head_img').attr('src', result.user.head_img);
        $('#nick_name').html(result.user.nickname);
        $('#article_content').html(result.content);
        var img_html = '';
        for (var i = 0; i < result.images.length; i++) {
            img_html += '<div class="userImg"><img src="/flwechat/public/storage/' + result.images[i].img + '" alt=""></div>'
        }
        $('#img').html(img_html);
        var action_html = '<div>'
            + '<img src="images/comment.png" alt="" onclick="comment(' + result.id + ')"><span id="comment">2</span>'
            + '</div><div>'
            + '<img id="img_oppose_' + result.id + '" src="images/oppose.png" alt="" onclick="action(' + result.id + ',1,this)"><span>' + result.oppose_num + '</span>'
            + '</div><div>'
            + '<img id="img_support_' + result.id + '" src="images/support.png" alt="" onclick="action(' + result.id + ',0,this)"><span>' + result.support_num + '</span></div>';
        $('#action').html(action_html);
        action_list();
        set_follow(result.user.id);
    });
});

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return decodeURI(r[2]);
    return null;
}

function test() {
    alert('hello');
}
