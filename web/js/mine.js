/**
 * Created by xzjs on 2017/2/8.
 */
$(document).ready(function () {
    var id=0;
    var user_id = $.cookie('id');
    if (user_id == null) {
        window.location.href = '/flwechat/web/index.html';
    }
    var show_id=$.cookie('show_id');
    if(show_id!=null){
        id=show_id;
        $.removeCookie('show_id');
        //$.cookie('show_id',null);
    }else{
        id=user_id;
    }
    $.getJSON('/flwechat/public/user/'+id, function (result) {
        $('#head_img')[0].src = result.head_img;
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
    if (result.length>0){
        $('.blank').remove();
    }
    for (var i = 0; i < result.length; i++) {
        var html_img = '';
        for (var j = 0; j < result[i].images.length; j++) {
            html_img += '<div class="userImg"><img src="/flwechat/public/storage/' + result[i].images[j].img+ '" alt=""></div>';
        }
        var html = '<div class="content">'
                + '<img src="' + result[i].user.head_img + '" alt="" class="head_portrait">'
                + '<span class="wei_name">' + result[i].user.nickname + '</span>'

                + '<span class="topic">' + result[i].topic.content + '</span>'
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
