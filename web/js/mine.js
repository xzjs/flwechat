/**
 * Created by xzjs on 2017/2/8.
 */
$(document).ready(function () {
    var id = 0;
    if (user_id == null) {
        window.location.href = '/flwechat/web/index.html';
    }
    var show_id = $.cookie('show_id');
    if (show_id != null) {
        id = show_id;
        $.removeCookie('show_id');
        $('#img').attr('src', 'images/follow.png');
        $.post('/flwechat/public/follow/get_follow_list',
            {'id': user_id, 'type': 0},
            function (result) {
                var flag=false;
                //TODO 当数据量大时，此处得切换为二分查找，时间复杂度从o(n)降为o(log(n))
                for(var i=0;i<result.length;i++){
                    if(result[i].id==user_id){
                        flag=true;
                        break;
                    }
                }

            }, 'json');
        $('#img').parent().attr('onclick', 'follow(' + id + ',0)');
    } else {
        id = user_id;
    }
    $.getJSON('/flwechat/public/user/' + id, function (result) {
        $('#head_img')[0].src = result.head_img;
        $('.name').html(result.nickname);
    });
    getArticleList('/flwechat/public/article/get_article_by_user_id/' + id);
    $('.messages span').click(function () {
        $(this).addClass('selected').siblings().removeClass('selected');
    })
});
