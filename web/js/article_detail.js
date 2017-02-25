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
            + '<a href="publish.html?id='+result.id+'"><img src="images/comment.png" alt=""></a><span id="comment">2</span>'
            + '</div><div>'
            + '<img id="img_oppose_' + result.id + '" src="images/oppose.png" alt="" onclick="action(' + result.id + ',1,this)"><span>' + result.oppose_num + '</span>'
            + '</div><div>'
            + '<img id="img_support_' + result.id + '" src="images/support.png" alt="" onclick="action(' + result.id + ',0,this)"><span>' + result.support_num + '</span></div>';
        $('#action').html(action_html);
        action_list();

        // $('.follow_action').data('id', result.user.id);
        set_follow(0);
    });
    getArticleList('/flwechat/public/article/article_list/'+article_id);

    $('#edit').on('click',function () {
        $('#do').show();
        $('#edit_article').attr('href','publish.html?id='+article_id+'&action=edit');
    });

    $('#close_dialog').on('click',function () {
        $('#do').hide();
    });
});
