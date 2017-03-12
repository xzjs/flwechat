/**
 * Created by xzjs on 2017/2/8.
 */
$(document).ready(function () {
    var id = 0;

    var show_id = data['user_id'];
    if (show_id != null) {
        if (show_id == user_id) {
            id = user_id;
            set_friend(1);
        } else {
            id = show_id;
            //为图片设置data
            $('.follow_action').data('id', id);
            set_follow(0);
            set_friend(0, show_id);
        }
    } else {
        id = user_id;
        set_friend(1);
    }
    $.getJSON('/flwechat/public/user/' + id, function (result) {
        $('#head_img')[0].src = result.head_img;
        $('.name').html(result.nickname);
        $('title').html(result.nickname);
        $('#follow_num').html(result.follow);
        $('#be_follow_num').html(result.be_follow);
    });
    // $('.messages span').on('click', function () {
    //     $(this).addClass('selected').siblings().removeClass('selected');
    //     $('.content_box').html('');
    //     var html = $(this).html();
    //     var url = '';
    //     if (html != '发布的文章') {
    //         // url = '/flwechat/public/article/comment_articles/' + id;
    //         // getArticleList(url);
    //         window.location.href = 'mine.html?user_id=' + user_id + '&comment=1';
    //     }
    // });
    // $('span').removeClass('selected');
    // if (data['comment'] == 1) {
    //     $('#comment').addClass('selected');
    // } else {
    //     $('#publish').addClass('selected');
    // }
});

function set_friend(type, show_id) {
    if (type == 0) {
        var html = '<div id="friend_toast" style="display: none;">'
            + '<div class="weui-mask_transparent"></div>'
            + '<div class="weui-toast">'
            + '<i class="weui-icon-success-no-circle weui-icon_toast"></i>'
            + '<p class="weui-toast__content">已发送好友邀请</p>'
            + '</div></div>';
        $('body').append(html);
        $('#friend').on('click', function () {
            $.post('/flwechat/public/friend',
                {'friend_post_id': user_id, 'friend_receive_id': show_id},
                function (result) {
                    if (result == 'true') {
                        var $toast = $('#friend_toast');

                        if ($toast.css('display') != 'none') return;

                        $toast.fadeIn(100);
                        setTimeout(function () {
                            $toast.fadeOut(100);
                        }, 2000);
                    }
                });
        });
    } else {
        $('#friend').on('click', function () {
            window.location.href = 'friend_add_messages.html';
        })
    }
}

var user=GetQueryString('user_id');
if(user==null){
    user=user_id;
}

var app = new Vue({
    el: '#app',
    data: {
        show: true,
        items: [],
        postData: {
            page: 0,
            size: 15,
            user_id: user
        }
    },
    mounted: function () {
        this.getArticles(0)
    },
    methods: {
        getArticles: function (comment,event) {
            var vm = this;
            vm.postData['comment'] = comment;
            vm.$http.post('/flwechat/public/article/article_list', vm.postData)
                .then(
                    function(response){
                    console.log(response.data);
                    vm.items = response.data;
                    if(response.data.length>0){
                        vm.show = false;
                    }else{
                        vm.show = true;
                    }
                }, function(response){
                    console.log(response.data);
                });
            if(event!=null){
                var element=$(event.target);
                element.addClass('selected').siblings().removeClass('selected');
            }
        }
    }
})
