/**
 * Created by xzjs on 2017/2/15.
 */
//查看用户
function show_user(id) {
    $.cookie('show_id', id);
    window.location.href = "mine.html";
}

//关注话题
function follow(topic_id, type) {
    $.post('/flwechat/public/follow',
        {'follow_user_id': user_id, 'be_follow_id': topic_id, 'type': type},
        function (result) {
            if (result > 0) {
                $('.weui-toast__content').html('已关注');
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

//取消关注话题
function cancel_follow(topic_id, type) {
    $.post('/flwechat/public/follow/cancel_follow',
        {'follow_user_id': user_id, 'be_follow_id': topic_id, 'type': type},
        function (result) {
            $('.weui-toast__content').html('已取消关注');
            var $toast = $('#toast');

            if ($toast.css('display') != 'none') return;

            $toast.fadeIn(100);
            setTimeout(function () {
                $toast.fadeOut(100);
            }, 2000);
            if (result == 'true' && type == 1) {
                change_follow_topic_style(topic_id);
            }
        });
}

//改变用户关注话题的样式
function change_follow_topic_style(topic_id) {
    $("span[data-id=" + topic_id + "]").toggleClass('topic_followed');
    if ($("span[data-id=" + topic_id + "]").hasClass('topic_followed')) {
        $("span[data-id=" + topic_id + "]").parent().attr('onclick', 'cancel_follow(' + topic_id + ',1)');
    } else {
        $("span[data-id=" + topic_id + "]").parent().attr('onclick', 'follow(' + topic_id + ',1)');
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

//显示大图
function show(image_id) {
    $.cookie('back', window.location.href);
    window.location.href = 'show.html?image_id=' + image_id;
}

//渲染文章列表
function showArticleList(result) {
    var myPublish = $('.content_box');
    $('.blank').remove();
    var myPublic_html = ''
    for (var i = 0; i < result.length; i++) {
        if (result[i].is_deleted == 0) {
            var html_img = '';
            for (var j = 0; j < result[i].images.length; j++) {
                html_img += '<div class="userImg" onclick="show(' + result[i].images[j].id + ')">' +
                    '<img src="/flwechat/public/storage/' + result[i].images[j].img + '" alt="" class="img_show">' +
                    '<img src="/flwechat/public/storage/' + result[i].images[j].mark + '" alt="" class="article_list_mark_img">' +
                    '</div>';
            }
            var html = '<div class="content">'
                + '<div class="content_top"><a href="mine.html?user_id=' + result[i].user.id + '">'
                + '<img src="' + result[i].user.head_img + '" alt="" class="head_portrait">'
                + '</a>'
                + '<span class="wei_name">' + result[i].user.nickname + '</span>';
            if (result[i].topic_id != null) {
                html += "<a href=\"javascript:void(0)\" onclick=\"follow(" + result[i].topic.id + ",1)\">"
                    + '<span class="topic" data-id="' + result[i].topic.id + '">#' + result[i].topic.content + '</span>'
                    + '</a>';
            }
            html += '</div>'
                + '<a href="article_detail.html?reply_id=' + result[i].id + '"><p class="content_txt">' + result[i].content + '</p></a>'
                + '<div class="pic_show">' + html_img + '</div>'
                + '<div class="your_action">'
                // +'<div><img src="images/share.png" alt=""><span>'+result_?+'</span></div>'
                + '<div class="your_action_right">'
                + '<a href="article_detail.html?reply_id=' + result[i].id + '">'
                + '<img src="images/comment.png" alt=""><span>' + result[i].comment_num + '</span></a></div>'
                + '<div class="your_action_right">'
                + '<img id="img_oppose_' + result[i].id + '" src="images/oppose.png" alt="" onclick="action(' + result[i].id + ',1,this)"><span id="span_oppose_' + result[i].id + '">' + result[i].oppose_num + '</span>'
                + '</div><div class="your_action_right">'
                + '<img id="img_support_' + result[i].id + '" src="images/support.png" alt="" onclick="action(' + result[i].id + ',0,this)"><span id="span_support_' + result[i].id + '">' + result[i].support_num + '</span></div>'
                + '</div></div>';
            myPublic_html += html;
        } else {
            var html = '<div class="content">'
                + '<div class="content_top"><a href="mine.html?user_id=' + result[i].user.id + '">'
                + '<img src="' + result[i].user.head_img + '" alt="" class="head_portrait">'
                + '</a>'
                + '<span class="wei_name">' + result[i].user.nickname + '</span>';
            if (result[i].topic_id != null) {
                html += "<a href=\"javascript:void(0)\" onclick=\"follow(" + result[i].topic.id + ",1)\">"
                    + '<span class="topic" data-id="' + result[i].topic.id + '">#' + result[i].topic.content + '</span>'
                    + '</a>';

            }
            html += '</div>'
                + '<a href="article_detail.html?id=' + result[i].id + '"><p class="content_txt">作者已删除该文章</p></a>'
                + '<div class="your_action">'
                // +'<div class="your_action_right"><img src="images/share.png" alt=""><span>'+result_?+'</span></div>'
                + '<div class="your_action_right">'
                + '<a href="article_detail.html?id=' + result[i].id + '">'
                + '<img src="images/comment.png" alt=""><span>' + result[i].comment_num + '</span></a></div>'
                + '<div class="your_action_right">'
                + '<img id="img_oppose_' + result[i].id + '" src="images/oppose.png" alt=""><span id="span_oppose_' + result[i].id + '">' + result[i].oppose_num + '</span>'
                + '</div><div class="your_action_right">'
                + '<img id="img_support_' + result[i].id + '" src="images/support.png" alt=""><span id="span_support_' + result[i].id + '">' + result[i].support_num + '</span></div>'
                + '</div></div>';
            myPublic_html += html;
        }
    }
    myPublish.append(myPublic_html);
    follow_topic_list(user_id);
    action_list();
    init_showimg();
}

//上拉加载
// dropload
$('.container').dropload({
    scrollArea: window,
    // loadUpFn: function (me) {
    //     data['page'] = 0;
    //     $.ajax({
    //         type: 'POST',
    //         url: '/flwechat/public/article/article_list',
    //         dataType: 'json',
    //         data: data,
    //         success: function (data) {
    //             $('.content_box').html('');
    //             showArticleList(data);
    //
    //             // 每次数据加载完，必须重置
    //             me.resetload();
    //             // 重置页数，重新获取loadDownFn的数据
    //             data['page'] = 0;
    //             // 解锁loadDownFn里锁定的情况
    //             me.unlock();
    //             me.noData(false);
    //
    //         },
    //         error: function (xhr, type) {
    //             console.log(xhr.responseText);
    //             // 即使加载出错，也得重置
    //             me.resetload();
    //         }
    //     });
    // },
    loadDownFn: function (me) {
        data['page']++;
        $.ajax({
            type: 'POST',
            url: '/flwechat/public/article/article_list',
            data: data,
            dataType: 'json',
            success: function (data) {
                var arrLen = data.length;
                if (arrLen > 0) {
                    showArticleList(data);
                    // 如果没有数据
                } else {
                    // 锁定
                    me.lock();
                    // 无数据
                    me.noData();
                }
                // 每次数据插入，必须重置
                me.resetload();
            },
            error: function (xhr, type) {
                console.log(xhr);
                // 即使加载出错，也得重置
                me.resetload();
            }
        });
    },
    threshold: 128
});