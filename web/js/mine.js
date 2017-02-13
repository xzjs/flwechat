/**
 * Created by xzjs on 2017/2/8.
 */
$(document).ready(function () {
    var id = $.cookie('id');
    if (id == null) {
        window.location.href = '/flwechat/web/index.html';
    }
    $.getJSON('/flwechat/public/user/'+id, function (result) {
        $('.head_portrait_top')[0].src = result.head_img;
        $('.name').html(result.nickname);
    });
    getArticleList();
    $('.message a').click(function () {
        $(this).addClass('selected').siblings().removeClass('selected');
    })
});
function getArticleList() {
    var id = $.cookie('id');
    $.getJSON('/flwechat/public/article/get_article_by_user_id/' + id, function (result) {
        showArticleList(result);
    })
}
function showArticleList(result) {
    var myPublish = $('.content_box');
    $('.blank').remove();
    for (var i = 0; i < result.length; i++) {
        var html_img = '';
        for (var j = 0; j < result[i].images.length; j++) {
            html_img += '<div class="userImg"><img src="' + result[i].images[j].img+ '" alt=""></div>';
        }
        var html = '<div class="content">'
            + '<img src="' + result[i].user.head_img + '" alt="" class="head_portrait">'
            + '<span class="wei_name">' + result[i].user.nickname + '</span>'
            + '<span class="topic">' + result[i].topic + '</span>'
            + '<p class="content_txt">' + result[i].content + '</p>'
            + '<div class="pic_show">' + html_img + '</div>'
            + '<div class="your_action">'
            // +'<div><img src="images/share.png" alt=""><span>'+result_?+'</span></div>'
            + '<div><img src="images/comment.png" alt=""><span>' + result[i].comment_num + '</span></div>'
            + '<div><img src="images/oppose.png" alt=""><span>' + result[i].oppose_num + '</span></div>'
            + '<div><img src="images/support.png" alt=""><span>' + result[i].support_num + '</span></div>'
            + '</div></div>';
        myPublish.append(html);
    }
}
