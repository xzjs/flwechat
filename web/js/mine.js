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

var user = GetQueryString('user_id');
if (user == null) {
    user = user_id;
}

Vue.component('action',{
    template:`<div class="your_action" id="action">
                <div class="your_action_left">
                    <a v-if="article.reply_id>0" :href="['article_detail.html?reply_id=' + article.reply_id]">
                        <img src="images/back_to_original.png" alt="">
                        <span>原文</span></a>
                </div>
                <!--<div class="your_action_right">-->
                <!--<img src="images/share.png" alt=""><span></span>-->
                <!--</div>-->
                <template v-if="article.user_id!=userId">
                <div class="your_action_right">
                    <img v-if="article.is_follow==0" src="images/save.png" alt="">
                    <img v-else src="images/saved.png" alt="">
                </div>
                </template>
                <div class="your_action_right">
                    <img src="images/comment.png" alt="">
                    <span id="comment">{{article.comment_num}}</span>
                </div>
                <div class="your_action_right">
                    <img v-if="article.is_oppose==0" src="images/oppose.png" alt="">
                    <img v-else src="images/oppose2.png" alt="">
                    <span id="oppose">{{article.oppose_num}}</span>
                </div>
                <div class="your_action_right">
                    <img v-if="article.is_support==0" src="images/support.png" alt="">
                    <img v-else src="images/support2.png" alt="">
                    <span id="support">{{article.support_num}}</span>
                </div>
            </div>`,
    props:['article'],
})

Vue.component('article-list', {
    template: `
        <div class="content_box" style="margin-top: 5px">
            <div v-cloak v-for="item in article_list" class="content">
                <div class="content_top">
                    <a :href="['mine.html?user_id='+item.user.id]">
                        <img :src="item.user.head_img" alt="" class="head_portrait">
                    </a>
                    <span class="wei_name">{{ item.user.nickname }}</span>
                    <a href="javascript:void(0)" onclick="follow(1,1)">
                        <span class="topic" :data-id="item.topic.id">{{item.topic.content}}</span>
                    </a>
                </div>
                <a :href="['article_detail.html?reply_id='+item.id]"><p class="content_txt">{{item.content}}</p></a>
                <div class=" swiper-container pic_show">
                    <div  class="swiper-wrapper pic_show_list">
                        <div v-for="img in item.images" class="swiper-slide userImg" @click="show_img(img.id)" >
                            <img :src="['/flwechat/public/storage/' + img.img]" alt="" class="img_show">
                            <img :src="['/flwechat/public/storage/' + img.mark]" alt="" class="article_list_mark_img">
                        </div>
                    </div>
                </div>
                <div class="your_action">
                    <div class="your_action_right">
                        <a :href="['article_detail.html?reply_id='+item.id]">
                            <img src="images/comment.png" alt=""><span>{{item.comment_num}}</span></a>
                    </div>
                    <div class="your_action_right">
                        <img id="img_oppose_19" src="images/oppose.png" alt="" onclick="action(19,1,this)">
                        <span id="span_oppose_19">{{item.oppose_num}}</span>
                    </div>
                    <div class="your_action_right">
                        <img id="img_support_19" src="images/support.png" alt="" onclick="action(19,0,this)">
                        <span id="span_support_19">{{item.support_num}}</span>
                    </div>
                </div>
            </div>
        </div>
    `,
    props:['article_list'],
    methods:{
        show_img: function (image_id) {
            $.cookie('back', window.location.href);
            window.location.href = 'show.html?image_id=' + image_id;
        }
    }
})

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
        getArticles: function (comment, event) {
            var vm = this;
            vm.postData['comment'] = comment;
            axios.post('/flwechat/public/article/article_list', vm.postData)
                .then(
                    function (response) {
                        console.log(response.data);
                        vm.items = response.data;
                        if (response.data.length > 0) {
                            vm.show = false;
                        } else {
                            vm.show = true;
                        }
                    }, function (response) {
                        console.log(response.data);
                    });
            if (event != null) {
                var element = $(event.target);
                element.addClass('selected').siblings().removeClass('selected');
            }
        }

    },
    updated: function () {
        var mySwiper = new Swiper('.swiper-container', {
            effect: 'coverflow',
            slidesPerView: 3,
            centeredSlides: true,
        });
    }
})
