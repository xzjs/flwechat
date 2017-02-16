/**
 * Created by xzjs on 2017/2/15.
 */
var user_id = $.cookie('id');

//查看用户
function show_user(id) {
    $.cookie('show_id', id);
    window.location.href = "mine.html";
}

//关注话题或用户
function follow(topic_id, type) {
    $.post('/flwechat/public/follow',
        {'follow_user_id': user_id, 'be_follow_id': topic_id, 'type': type},
        function (result) {
            if (result > 0) {
                var $toast = $('#toast');

                if ($toast.css('display') != 'none') return;

                $toast.fadeIn(100);
                setTimeout(function () {
                    $toast.fadeOut(100);
                }, 2000);
                if (type == 1) {
                    change_follow_topic_style(topic_id);
                }
            }
        });
}

//获取关注列表
function follow_topic_list(user_id) {
    $.post('/flwechat/public/follow/get_follow_list',
        {'id': user_id, 'type': 1},
        function (result) {
            for (var i = 0; i < result.length; i++) {
                change_follow_topic_style(result[i].id);
            }
        },
        "json"
    );
}

//取消关注话题或用户
function cancel_follow(topic_id, type) {
    $.post('/flwechat/public/follow/cancel_follow',
        {'follow_user_id': user_id, 'be_follow_id': topic_id, 'type': type},
        function (result) {
            if (result == 'true' && type == 1) {
                change_follow_topic_style(topic_id);
            }
        });
}

//改变用户关注话题的样式
function change_follow_topic_style(topic_id) {
    $("span[data-id=" + topic_id + "]").toggleClass('topic_followed');
    if ($("span[data-id=" + topic_id + "]").hasClass('topic_followed')) {
        $("span[data-id=" + topic_id + "]").parent().attr('onclick', 'cancel_follow(' + topic_id + ')');
    }
}

//点赞或踩
function action(article_id, type, obj) {
    $.post('/flwechat/public/action',
        {'user_id': user_id, 'article_id': article_id, 'type': type},
        function (result) {
            if (result == 'true') {
                var src = "";
                if (type == 0) {
                    src = 'images/support2.png';
                } else {
                    src = 'images/oppose2.png';
                }
                $(obj).attr('src', src);
                var num = parseInt($(obj).siblings('span').html()) + 1;
                $(obj).siblings('span').html(num);
            } else {
                console.log(result);
            }
        });
}

//设置点赞或者踩的图片
function set_img(article_id, type) {
    var temp = 'support_';
    var src = 'images/support2.png';
    if (type == 1) {
        temp = 'oppose_'
        src = 'images/oppose2.png';
    }
    $('#img_' + temp + article_id).attr('src', src);
}

function action_list() {
    $.getJSON('/flwechat/public/action/' + user_id, function (result) {
        for (var i = 0; i < result.length; i++) {
            set_img(result[i].article_id, result[i].type);
        }
    })
}

function getArticleList(url) {
    $.getJSON(url, function (result) {
        showArticleList(result);
    });
}

function comment(reply_id) {
    $.cookie('reply_id', reply_id);
    window.location.href = 'publish.html';
}

function showArticleList(result) {
    var myPublish = $('.content_box');
    $('.blank').remove();
    for (var i = 0; i < result.length; i++) {
        var html_img = '';
        for (var j = 0; j < result[i].images.length; j++) {
            html_img += '<div class="userImg"><img src="/flwechat/public/storage/' + result[i].images[j].img + '" alt=""></div>';
        }
        var html = '<div class="content">'
            + '<a href="javascript:void(0);" onclick="show_user(' + result[i].user.id + ')">'
            + '<img src="' + result[i].user.head_img + '" alt="" class="head_portrait">'
            + '</a>'
            + '<span class="wei_name">' + result[i].user.nickname + '</span>'
            + "<a href=\"javascript:void(0)\" onclick=\"follow(" + result[i].topic.id + ",1)\">"
            + '<span class="topic" data-id="' + result[i].topic.id + '">' + result[i].topic.content + '</span>'
            + '</a>'
            + '<a href="article_detail.html?id=' + result[i].id + '"><p class="content_txt">' + result[i].content + '</p></a>'
            + '<div class="pic_show">' + html_img + '</div>'
            + '<div class="your_action">'
            // +'<div><img src="images/share.png" alt=""><span>'+result_?+'</span></div>'
            + '<div>'
            + '<a href="publish.html?id'+result[i].id+'">'
            + '<img src="images/comment.png" alt=""><span>' + result[i].comment_num + '</span></a></div>'
            + '<div>'
            + '<img id="img_oppose_' + result[i].id + '" src="images/oppose.png" alt="" onclick="action(' + result[i].id + ',1,this)"><span id="span_oppose_' + result[i].id + '">' + result[i].oppose_num + '</span>'
            + '</div><div>'
            + '<img id="img_support_' + result[i].id + '" src="images/support.png" alt="" onclick="action(' + result[i].id + ',0,this)"><span id="span_support_' + result[i].id + '">' + result[i].support_num + '</span></div>'
            + '</div></div>';
        myPublish.append(html);

        follow_topic_list(user_id);
        action_list();
    }
}