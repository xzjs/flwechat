/**
 * Created by yanlli on 2017/2/14.
 */

var article_id = GetQueryString('id');

$(function () {

    loadMainData();
    getArticleList('/flwechat/public/article/article_list/' + article_id);

    $('#edit').on('click', function () {
        $('#do').show();
        $('#edit_article').attr('href', 'publish.html?id=' + article_id + '&action=edit');
        $('#delete_article').one('click', function () {
            $('#dialog1').show();
        })
    });

    $('#close_dialog').on('click', function () {
        $('#do').hide();
    });
});

function loadMainData() {
    $.getJSON('/flwechat/public/article/' + article_id, function (result) {
        $('#head_img').attr('src', result.user.head_img);
        $('#nick_name').html(result.user.nickname);
        if (result.is_deleted == 0) {
            $('#article_content').html(result.content);
            var img_html = '';
            for (var i = 0; i < result.images.length; i++) {
                img_html += '<div class="userImg"><img src="/flwechat/public/storage/' + result.images[i].img + '" alt=""></div>'
            }
            $('#img').html(img_html);
            if (result.user_id == user_id) {
                $('#edit').show();
            }
            var action_html = '<div class="your_action_left">';
            if (result.reply_id > 0) {
                action_html += '<a href="article_detail.html?id=' + result.reply_id + '"><img src="images/back_to_original.png" alt=""><span>原文</span></a>';
            }
            action_html += '</div><div class="your_action_right">'
                + '<a href="publish.html?id=' + result.id + '"><img src="images/comment.png" alt=""></a><span id="comment">' + result.comment_num + '</span>'
                + '</div><div class="your_action_right">'
                + '<img id="img_oppose_' + result.id + '" src="images/oppose.png" alt="" onclick="action(' + result.id + ',1,this)"><span>' + result.oppose_num + '</span>'
                + '</div><div class="your_action_right">'
                + '<img id="img_support_' + result.id + '" src="images/support.png" alt="" onclick="action(' + result.id + ',0,this)"><span>' + result.support_num + '</span></div>';
            $('#action').html(action_html);
        }else{
            $('#article_content').html('用户已删除该文章');
            var action_html = '<div class="your_action_left">';
            $('#img').html('');
            if (result.reply_id > 0) {
                action_html += '<a href="article_detail.html?id=' + result.reply_id + '"><img src="images/back_to_original.png" alt=""><span>原文</span></a>';
            }
            action_html += '</div><div class="your_action_right">'
                + '<a href="#"><img src="images/comment.png" alt=""></a><span id="comment">' + result.comment_num + '</span>'
                + '</div><div class="your_action_right">'
                + '<img id="img_oppose_' + result.id + '" src="images/oppose.png" alt="" ><span>' + result.oppose_num + '</span>'
                + '</div><div class="your_action_right">'
                + '<img id="img_support_' + result.id + '" src="images/support.png" alt="" ><span>' + result.support_num + '</span></div>';
            $('#action').html(action_html);
        }
        action_list();
    });
}

function cancel() {
    $('#dialog1').hide();
    $('#do').hide();
}

function confirm() {
    var article_id = GetQueryString('id');
    $.ajax({
        url: '/flwechat/public/article/' + article_id,
        type: 'DELETE',
        success: function (result) {
            cancel();
            loadMainData();
        }
    });
}
