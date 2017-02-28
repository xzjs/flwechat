/**
 * Created by yanlli on 2017/2/14.
 */

var article_id = GetQueryString('id');
var icon = '/flwechat/web/images/topic.png';
var desc='';

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
                img_html += '<div class="userImg"><img data-id="' + result.images[i].id + '" class="img_show" src="/flwechat/public/storage/' + result.images[i].img + '" alt=""></div>'
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
                + '<a href="publish.html?id="><img src="images/share.png" alt=""></a><span id="share">' + +'</span>'
                + '</div><div class="your_action_right">'
                + '<a href="publish.html?id=' + result.id + '"><img src="images/comment.png" alt=""></a><span id="comment">' + result.comment_num + '</span>'
                + '</div><div class="your_action_right">'
                + '<img id="img_oppose_' + result.id + '" src="images/oppose.png" alt="" onclick="action(' + result.id + ',1,this)"><span>' + result.oppose_num + '</span>'
                + '</div><div class="your_action_right">'
                + '<img id="img_support_' + result.id + '" src="images/support.png" alt="" onclick="action(' + result.id + ',0,this)"><span>' + result.support_num + '</span></div>';
            $('#action').html(action_html);

            //设置分享
            $.post('/flwechat/public/getconfig',
                {'url': window.location.href},
                function (config) {
                    console.log(config);
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: config.appId, // 必填，公众号的唯一标识
                        timestamp: config.timestamp, // 必填，生成签名的时间戳
                        nonceStr: config.nonceStr, // 必填，生成签名的随机串
                        signature: config.signature,// 必填，签名，见附录1
                        jsApiList: config.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });

                    if (result.images.length > 0) {
                        icon = result.images[0].img;
                    }
                    desc=result.content;
                    wx.onMenuShareTimeline({
                        title: desc, // 分享标题
                        desc:desc,
                        link: window.location.href, // 分享链接
                        imgUrl: "http://"+window.location.host+"/flwechat/public/storage/"+icon, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            alert('分享成功');
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            alert('取消分享');
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: desc, // 分享标题
                        desc: desc, // 分享描述
                        link: window.location.href, // 分享链接
                        imgUrl: "http://"+window.location.host+"/flwechat/public/storage/"+icon, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            alert('分享成功');
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            alert('取消分享');
                        }
                    });
                },'json');

        } else {
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
        $('.img_show').on('click', bandImageClick());
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