/**
 * Created by xzjs on 2017/2/8.
 */
// $(document).ready(function () {
//     var id = 0;
//
//     var show_id = data['user_id'];
//     if (show_id != null) {
//         if (show_id == user_id) {
//             id = user_id;
//             set_friend(1);
//         } else {
//             id = show_id;
//             //为图片设置data
//             $('.follow_action').data('id', id);
//             set_follow(0);
//             set_friend(0, show_id);
//         }
//     } else {
//         id = user_id;
//         set_friend(1);
//     }
//     $.getJSON('/flwechat/public/user/' + id, function (result) {
//         $('#head_img')[0].src = result.head_img;
//         $('.name').html(result.nickname);
//         $('title').html(result.nickname);
//         $('#follow_num').html(result.follow);
//         $('#be_follow_num').html(result.be_follow);
//     });
//     // $('.messages span').on('click', function () {
//     //     $(this).addClass('selected').siblings().removeClass('selected');
//     //     $('.content_box').html('');
//     //     var html = $(this).html();
//     //     var url = '';
//     //     if (html != '发布的文章') {
//     //         // url = '/flwechat/public/article/comment_articles/' + id;
//     //         // getArticleList(url);
//     //         window.location.href = 'mine.html?user_id=' + user_id + '&comment=1';
//     //     }
//     // });
//     // $('span').removeClass('selected');
//     // if (data['comment'] == 1) {
//     //     $('#comment').addClass('selected');
//     // } else {
//     //     $('#publish').addClass('selected');
//     // }
// });

// function set_friend(type, show_id) {
//     if (type == 0) {
//         var html = '<div id="friend_toast" style="display: none;">'
//             + '<div class="weui-mask_transparent"></div>'
//             + '<div class="weui-toast">'
//             + '<i class="weui-icon-success-no-circle weui-icon_toast"></i>'
//             + '<p class="weui-toast__content">已发送好友邀请</p>'
//             + '</div></div>';
//         $('body').append(html);
//         $('#friend').on('click', function () {
//             $.post('/flwechat/public/friend',
//                 {'friend_post_id': user_id, 'friend_receive_id': show_id},
//                 function (result) {
//                     if (result == 'true') {
//                         var $toast = $('#friend_toast');
//
//                         if ($toast.css('display') != 'none') return;
//
//                         $toast.fadeIn(100);
//                         setTimeout(function () {
//                             $toast.fadeOut(100);
//                         }, 2000);
//                     }
//                 });
//         });
//     } else {
//         $('#friend').on('click', function () {
//             window.location.href = 'friend_add_messages.html';
//         })
//     }
// }

var show_user_id = GetQueryString('user_id');
if (show_user_id == null) {
    show_user_id = user_id;
}

Vue.config.devtools = true

var action = Vue.extend({
    template: `<div class="your_action" id="action">
                <div v-if="article.reply_id>0" class="your_action_right">
                    <a  :href="'article_detail.html?reply_id=' + article.reply_id">
                        <img src="images/back_to_original.png" alt="">
                        <span>原文</span>
                     </a>
                </div>
                <div class="your_action_right" @click="support">
                    <p v-if="article.is_support==0">赞<span>{{article.support_num}}</span></p>
                    <p v-else style="color:#0084FF">赞<span>{{article.support_num}}</span></p>
                </div>
                <div class="your_action_right" @click="oppose()">
                    <p v-if="article.is_oppose==0">踩<span>{{article.oppose_num}}</span></p>
                    <p v-else style="color:#0084FF">踩<span>{{article.oppose_num}}</span></p>
                </div>
                <!--<div class="your_action_right">-->
                <!--<img src="images/share.png" alt=""><span></span>-->
                <!--</div>-->
                <div class="your_action_right" @click="detail()">
                    <p>评论<span>{{article.comment_num}}</span></p>
                </div>
                <template v-if="article.user_id!=userId">
                <div class="your_action_right">
                    <img v-if="article.is_follow==0" src="images/follow.png" alt="">
                    <img v-else src="images/follow3.png" alt="">
                </div>
                </template>               
            </div>`,
    props: ['article'],
    data: function () {
        return {
            userId: 0
        }
    },
    created: function () {
        this.userId = user_id;
    },
    methods: {
        detail: function () {
            window.location.href = 'article_detail.html?reply_id=' + this.article.id;
        },
        support: function () {
            if (this.article.is_support == 0) {
                this.article.is_support = 1;
                this.article.support_num += 1;
                axios.post('/flwechat/public/action',
                    {article_id: this.article.id, user_id: this.userId, type: 0})
                    .then(
                        function (response) {
                            console.log(response.data);
                        }, function (response) {
                            console.log(response.data);
                        });
            } else {
                this.article.is_support = 0;
                this.article.support_num -= 1;
                axios.post('/flwechat/public/action/cancel',
                    {article_id: this.article.id, user_id: this.userId, type: 0})
                    .then(
                        function (response) {
                            console.log(response.data);
                        }, function (response) {
                            console.log(response.data);
                        });
            }
        },
        oppose: function () {
            if (this.article.is_oppose == 0) {
                this.article.is_oppose = 1;
                this.article.oppose_num += 1;
                axios.post('/flwechat/public/action',
                    {article_id: this.article.id, user_id: this.userId, type: 1})
                    .then(
                        function (response) {
                            console.log(response.data);
                        }, function (response) {
                            console.log(response.data);
                        });
            } else {
                this.article.is_oppose = 0;
                this.article.oppose_num -= 1;
                axios.post('/flwechat/public/action/cancel',
                    {article_id: this.article.id, user_id: this.userId, type: 1})
                    .then(
                        function (response) {
                            console.log(response.data);
                        }, function (response) {
                            console.log(response.data);
                        });
            }
        }
    }
});

var image_moudle = Vue.extend({
    template: `<div class=" swiper-container pic_show">
                    <div  class="swiper-wrapper pic_show_list">
                        <div v-for="img in images" class="swiper-slide userImg" @click="show_img(img.id)" >
                            <img :src="'http://images.frilink.cn/' + img.img+'-image'" alt="" class="img_show">
                            <img :src="['/flwechat/public/storage/' + img.mark]" alt="" class="article_list_mark_img">
                        </div>
                    </div>
                </div>`,
    props: ['images'],
    methods: {
        show_img: function (image_id) {
            $.cookie('back', window.location.href);
            window.location.href = 'show.html?image_id=' + image_id;
        }
    },
    mounted: function () {
        console.log('mounted');
        var mySwiper = new Swiper('.swiper-container', {
            effect: 'coverflow',
            slidesPerView: 3,
            centeredSlides: true,
        });
    },
    updated: function () {
        console.log('updated');
        var mySwiper = new Swiper('.swiper-container', {
            effect: 'coverflow',
            slidesPerView: 3,
            centeredSlides: true,
        });
    }
});

Vue.component('article-list', {
    template: `
        <div class="content_box" style="margin-top: 5px">
            <div v-cloak v-for="item in article_list" class="content">
                <div class="content_top">
                    <a :href="['mine.html?user_id='+item.user.id]">
                        <img :src="item.user.head_img" alt="" class="head_portrait"><span class="wei_name">{{item.user.nickname}}&bull;<span>{{item.topic.content}}</span></span>
                    </a>                    
                </div>
                <div v-if="item.is_deleted==0">
                    <a :href="'article_detail.html?reply_id='+item.id"><p class="content_txt">{{item.content}}</p></a>
                <image_moudle :images="item.images"></image_moudle>
                </div>
                <a v-else :href="'article_detail.html?reply_id='+item.id"><p class="content_txt">该文章已被作者删除</p></a>
                <action :article="item"></action>
            </div>
        </div>
    `,
    props: ['article_list'],
    methods: {},
    components: {
        action,
        image_moudle
    }
});

var app = new Vue({
    el: '#app',
    data: {
        show: true,
        items: [],
        postData: {
            page: 0,
            size: 15
        },
        select: [false, true, false],
        show_user_id: show_user_id,
        user_id: user_id,
        user: {},
        is_follow: false,
        is_friend:false
    },
    mounted: function () {
        this.getArticles(1);
        this.loadUser()
    },
    methods: {
        getArticles: function (index) {
            var vm = this;
            for (var i = 0; i < vm.select.length; i++) {
                vm.select[i] = false;
            }
            vm.select[index] = true;
            switch (index) {
                case 0:
                    vm.postData = {page: 0, size: 15, user_id: vm.show_user_id, is_public: 0, type: 4};
                    break;
                case 1:
                    vm.postData = {page: 0, size: 15, user_id: vm.show_user_id, is_public: 1, type: 4};
                    break;
                case 2:
                    vm.postData = {page: 0, size: 15, user_id: vm.show_user_id, follow_article: 1};
                    break;
            }
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
        },
        loadUser: function () {
            var vm = this;
            //获取用户信息
            axios.get('/flwechat/public/user/' + vm.show_user_id)
                .then(function (response) {
                    vm.user = response.data;
                    console.log(response.data);
                })
                .catch(function (response) {
                    console.log(response);
                });
            if (vm.show_user_id != vm.user_id) {
                //检测是否关注
                axios.post('/flwechat/public/follow/get_follow_list',
                    {id: vm.user_id, type: 0})
                    .then(function (response) {
                        var follows = response.data;
                        console.log(follows);
                        for (var i = 0; i < follows.length; i++) {
                            if (follows[i].id == vm.show_user_id) {
                                vm.is_follow = true;
                                break;
                            }
                        }
                    })
                    .catch(function (response) {
                        console.log(response);
                    });
                //检测是否为好友
                axios.post('/flwechat/public/friend/get_friends',
                    {id:vm.user_id,type:0})
                    .then(function (response) {
                        var friends = response.data;
                        console.log(friends);
                        for (var i = 0; i < friends.length; i++) {
                            if (friends[i].id == vm.show_user_id) {
                                vm.is_friend = true;
                                break;
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            }

        },
        follow:function () {
            var vm=this;
            axios.post('/flwechat/public/follow',
                {follow_user_id:vm.user_id,be_follow_id:vm.show_user_id,type:0})
                .then(function (response) {
                    console.log(response.data);
                    if(response.data>0){
                        vm.user.be_follow+=1;
                        vm.is_follow=true;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        cancelFollow:function () {
            var vm=this;
            axios.post('/flwechat/public/follow/cancel_follow',
                {follow_user_id:vm.user_id,be_follow_id:vm.show_user_id,type:0})
                .then(function (response) {
                    console.log(response.data);
                    if(response.data==true){
                        if(vm.user.be_follow>0){
                            vm.user.be_follow-=1;
                            vm.is_follow=false;
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        makeFriend:function () {
            var vm=this;
            axios.post('/flwechat/public/friend',
                {friend_post_id: vm.user_id, friend_receive_id: vm.show_user_id})
                .then(function (response) {
                    console.log(response.data);
                    if(response.data==true){
                        alert('好友请求已发送');
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        goMessage:function () {
            window.location.href = 'friend_add_messages.html';
        }
    }
});
