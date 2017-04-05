/**
 * Created by yanlli on 2017/2/6.
 */

$(".container").css('min-height',$(window).height());
$(".content_box").css('width',$(window).width());
var user_id = $.cookie('id');
if (user_id == null) {
    var test = window.location.href;
    console.log(test);
    $.cookie('parameter', test, {expires: 1, path: '/'});
    window.location.href = '/flwechat/public/getuser';
}

//上拉下拉数据
var data = {'page': -1, 'size': 15, 'reply_id': 0};

//获取url中的参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return decodeURI(r[2]);
    return null;
}

// data['topic_id'] = GetQueryString('topic_id');
// data['user_id'] = GetQueryString('user_id');
// data['reply_id'] = GetQueryString('reply_id');
// data['comment'] = GetQueryString('comment');

var homepage_icon = $('.homepage_icon'),
    follow_icon = $('.follow_icon'),
    publish_icon = $('.publish_icon'),
    friend_icon = $('.friend_icon'),
    mine_icon = $('.mine_icon');
$('.weui-tabbar__item').on('click', function () {
    $(this).addClass('weui-bar__item_on').siblings('.weui-bar__item_on').removeClass('weui-bar__item_on');
});

