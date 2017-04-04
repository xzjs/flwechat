/**
 * Created by yanlli on 2017/1/16.
 */
$(function () {
    //getTopicList();
});
// $('.more').on('click', function () {
//     $('.more').hide();
//     $('.close').show();
//     $('.topic_index_box').css('height', '120px');
//     // $('')
//     // var i=0;
//     // $('.topic_index img').on('click',function () {
//     //     if (i<3){
//     //         $(this).attr('src','images/choose.png');
//     //         $(this).parent().siblings().data('id','1');
//     //         //设置data-id
//     //         console.log($(this).parent().siblings().data());
//     //         var top_topic_index=$(this).parent().siblings().html();
//     //         $('.recommend').after('<span class="top_topic_index">'+top_topic_index+'</span>');
//     //         i++;
//     //     }else{
//     //         alert('最多选择3个标签');
//     //         return
//     //     }
//     // });
// });
// $('.close').on('click', function () {
//     $('.more').show();
//     $('.close').hide();
//     $('.topic_index_box').css('height', '30px');
// });

//获取标签列表
function getTopicList() {
    $.getJSON('/flwechat/public/topic', function (result) {
        var topicList = ''
        for (var i = 0; i < result.length; i++) {
            topicList += '<a href="index.html?topic_id=' + result[i].id + '" class="topic_index" data-id="' + result[i].id + '">' + result[i].content + '</a>'
        }
        $('.topic_index_box nav').append(topicList);
        if (data['topic_id'] != null) {
            $('a[data-id="' + data['topic_id'] + '"]').addClass('topic_index_selected').siblings('.topic_index').removeClass('topic_index_selected');
        }
        // $('.topic_index').on('click',function () {
        //     $(this).addClass('topic_index_selected').siblings('.topic_index').removeClass('topic_index_selected');
        //     getArticleList('/flwechat/public/article/get_article_by_topic/'+$(this).data('id'));
        // });
    });
}

function check() {
    $.post('/flwechat/public/article/search',
        {'keyword': $('#searchInput').val(),},
        function (result) {
            showArticleList(result);
            cancelSearch();
        }, 'json');
    return false;
}
// $('.pic_show_list').click(function () {
//    $(this).css('width','500px');
// });

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
                <div class="your_action_right" @click="follow()">
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
        },
        follow: function () {
            if (this.article.is_follow == 0) {
                this.article.is_follow = 1;
                axios.post('/flwechat/public/follow',
                    {follow_user_id: this.userId, be_follow_id: this.article.id, type: 1})
                    .then(
                        function (response) {
                            console.log(response.data);
                        }, function (response) {
                            console.log(response.data);
                        });
            } else {
                this.article.is_follow = 0;
                axios.post('/flwechat/public/follow/cancel_follow',
                    {follow_user_id: this.userId, be_follow_id: this.article.id, type: 1})
                    .then(
                        function (response) {
                            console.log(response.data);
                        }, function (response) {
                            console.log(response.data);
                        });
            }
        }
    }
})

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
})

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
})

var app = new Vue({
    el: '#app',
    data: {
        show: true,
        items: [],
        postData: {
            page: 0,
            size: 15,
            user_id: user_id,
            reply_id: 0
        },
        topics: [{'id': 0, 'content': '全部'}],
        selectIndex: 0,
        select: [true],
    },
    mounted: function () {
        this.getTopics();
    },
    methods: {
        getArticles: function () {
            var vm = this;
            vm.postData.topic_id = vm.topics[vm.selectIndex].id;
            axios.post('/flwechat/public/article/article_list', vm.postData)
                .then(
                    function (response) {
                        console.log(response.data);
                        vm.items = response.data;
                    })
                .catch(
                    function (response) {
                        console.log(response.data);
                    }
                );
        },
        getTopics: function () {
            var vm = this;
            axios.get('/flwechat/public/topic')
                .then(
                    function (response) {
                        console.log(response.data);
                        Array.prototype.push.apply(vm.topics, response.data);
                        for (var i = 1; i < vm.topics.length; i++) {
                            vm.select.push(false);
                        }
                        vm.getArticles();
                    }
                ).catch(
                function (error) {
                    console.log(error);
                }
            )
        },
        selectTopic: function (index) {
            for (var i = 0; i < this.select.length; i++) {
                this.select[i] = false;
            }
            this.select[index] = true;
            this.selectIndex = index;
            this.getArticles();
        },
        search: function () {
            var vm = this;
            axios.post('/flwechat/public/article/article_list',
                {page: 0, size: 15, user_id: user_id, key_word: $('#searchInput').val()})
                .then(
                    function (response) {
                        console.log(response.data);
                        vm.items = response.data;
                    })
                .catch(
                    function (response) {
                        console.log(response.data);
                    }
                );
            $('#searchBar').removeClass('weui-search-bar_focusing');
            $('#searchText').show();
            $('#searchInput').blur();
        }
    }
})



