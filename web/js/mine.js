/**
 * Created by xzjs on 2017/2/8.
 */
$(document).ready(function () {
    var id = 0;

    var show_id = GetQueryString('id');
    if (show_id != null) {
        id = show_id;
        set_follow(id);
    } else {
        id = user_id;
    }
    $.getJSON('/flwechat/public/user/' + id, function (result) {
        $('#head_img')[0].src = result.head_img;
        $('.name').html(result.nickname);
        $('title').html(result.nickname);
    });
    getArticleList('/flwechat/public/article/get_article_by_user_id/' + id);
    $('.messages span').click(function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        var html=$(this).html();
        var url='';
        if(html=='发布的文章'){
            url='/flwechat/public/article/get_article_by_user_id/' + id;
        }else{
            url='/flwechat/public/article/comment_articles/' + id;
        }
        getArticleList(url);
    })
});
