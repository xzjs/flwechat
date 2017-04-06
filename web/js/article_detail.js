/**
 * Created by yanlli on 2017/2/14.
 */
var icon = '/flwechat/web/images/topic.png';
var desc = '';
var follow_list;
var article;

$(function () {

    //loadMainData();
    //getArticleList('/flwechat/public/article/article_list/' + article_id);

    $('#edit').on('click', function () {
        $('#do').show();
        $('#edit_article').attr('href', 'publish.html?reply_id=' + article_id + '&action=edit');
        $('#delete_article').one('click', function () {
            $('#dialog1').show();
        })
    });

    $('#close_dialog').on('click', function () {
        $('#do').hide();
    });
    if ($('.pic_show_list').html() == '') {
        $(this).hide();
    }

});

//显示大图
function show(image_id) {
    $.cookie('back', window.location.href);
    window.location.href = 'show.html?image_id=' + image_id;
}

function loadMainData() {
    $.getJSON('/flwechat/public/article/' + data['reply_id'], function (result) {
        $('#head_img').attr('src', result.user.head_img);
        $('#nick_name').html(result.user.nickname);
        if (result.is_deleted == 0) {
            $('#article_content').html(result.content);
            var img_html = '';
            for (var i = 0; i < result.images.length; i++) {
                img_html += '<div class="userImg" onclick="show(' + result.images[i].id + ')">' +
                    '<img class="img_show" src="/flwechat/public/storage/' + result.images[i].img + '" alt="">' +
                    '<img src="/flwechat/public/storage/' + result.images[i].mark + '" alt="" class="article_list_mark_img">' +
                    '</div>';
            }
            $('#img').html(img_html);
            if (result.user_id == user_id) {
                $('#edit').show();
            }
            var action_html = '<div class="your_action_left">';
            if (result.reply_id > 0) {
                action_html += '<a href="article_detail.html?reply_id=' + result.reply_id + '"><img src="images/back_to_original.png" alt=""><span>原文</span></a>';
            }
            action_html += '</div><div class="your_action_right">'
                + '<img id="img_support_' + result.id + '" src="images/support.png" alt="" onclick="action(' + result.id + ',0,this)"><span>' + result.support_num + '</span></div>'
                + '</div><div class="your_action_right">'
                + '<img id="img_oppose_' + result.id + '" src="images/oppose.png" alt="" onclick="action(' + result.id + ',1,this)"><span>' + result.oppose_num + '</span>'
                + '</div><div class="your_action_right">'
                + '<img src="images/comment.png" alt=""><span id="comment">' + result.comment_num + '</span>'
                + '</div><div class="your_action_right">'
                + '<img id="img_save_' + result.id + '" src="images/follow.png" alt="" onclick="follow(' + result.id + ',0,this)"></div>';
            $('#action').html(action_html);

            //评论按钮
            $('.comment_input a').attr('href', 'publish.html?reply_id=' + result.id);
            // $('.comment_input').html('<a href="publish.html?id=' + result.id + '">');
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
                    desc = result.content;
                    wx.onMenuShareTimeline({
                        title: desc, // 分享标题
                        desc: desc,
                        link: window.location.href, // 分享链接
                        imgUrl: "http://" + window.location.host + "/flwechat/public/storage/" + icon, // 分享图标
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
                        imgUrl: "http://" + window.location.host + "/flwechat/public/storage/" + icon, // 分享图标
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
                }, 'json');

        } else {
            $('#article_content').html('用户已删除该文章');
            var action_html = '<div class="your_action_left">';
            $('#img').html('');
            if (result.reply_id > 0) {
                action_html += '<a href="article_detail.html?reply_id=' + result.reply_id + '"><img src="images/back_to_original.png" alt=""><span>原文</span></a>';
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
    var article_id = GetQueryString('reply_id');
    $.ajax({
        url: '/flwechat/public/article/' + article_id,
        type: 'DELETE',
        success: function (result) {
            cancel();
            loadMainData();
        }
    });
}

Vue.config.devtools = true

var action_module = Vue.extend({
    template: `<div class="your_action" id="action">
                <div class="your_action_right"  v-if="article.reply_id>0 && is_comment==false">
                    <a :href="'article_detail.html?reply_id=' + article.reply_id">
                        <img src="images/back_to_original.png" alt=""><span>原文</span>
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
    props: {
        article,
        is_comment: {
            default: false
        },
    },
    data: function () {
        return {
            userId: 0
        }
    }
    ,
    created: function () {
        this.userId = user_id;
    }
    ,
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

var article_module = Vue.extend({
    template: `
        <div class="content_box">
            <div v-cloak v-for="item in article_list" class="content">
                <div class="content_top">
                <a :href="['mine.html?user_id='+item.user.id]">
                        <img :src="item.user.head_img" alt="" class="head_portrait"><span class="wei_name">{{item.user.nickname}}&bull;<span>{{item.topic.content}}</span></span>
                    </a>                    
                </div>
                <div v-if="item.is_deleted==0">
                    <a :href="'article_detail.html?reply_id='+item.id"><p class="content_txt">{{item.content}}</p></a>
                <div v-if="item.images.length>0" class=" swiper-container pic_show">
                    <div  class="swiper-wrapper pic_show_list">
                        <div v-for="img in item.images" class="swiper-slide userImg" @click="show_img(img.id)" >
                            <img :src="'http://images.frilink.cn/' + img.img+'-image'" alt="" class="img_show">
                            <img :src="['/flwechat/public/storage/' + img.mark]" alt="" class="article_list_mark_img">
                        </div>
                    </div>
                </div>
                </div>
                <a v-else :href="'article_detail.html?reply_id='+item.id"><p class="content_txt">该文章已被作者删除</p></a>
                
                <action_module :article="item" :is_comment="true"></action_module>
            </div>
        </div>
    `,
    props: ['article_list'],
    methods: {
        show_img: function (image_id) {
            $.cookie('back', window.location.href);
            window.location.href = 'show.html?image_id=' + image_id;
        }
    },
    components: {
        action_module
    }
});
var app = new Vue({
    el: '#app',
    data: {
        article: null,
        article_list: [],
        article_id: 0,
        userId: 0,
        isDoShow:false
    },
    components: {
        action_module,
        article_module
    },
    methods: {
        getArticle: function () {
            var vm = this;
            axios.post('/flwechat/public/article/get_article',
                {article_id: vm.article_id, user_id: vm.userId})
                .then(
                    function (response) {
                        console.log(response.data);
                        vm.article = response.data;
                    }
                ).catch(
                function (error) {
                    console.log(error);
                }
            )
        },
        getArticleList: function () {
            var vm = this;
            axios.post('/flwechat/public/article/article_list',
                {page: 0, size: 15, reply_id: vm.article_id, user_id: vm.userId})
                .then(
                    function (response) {
                        console.log(response.data);
                        vm.article_list = response.data;

                    }, function (response) {
                        console.log(response.data);
                    });
        },
        changeDo:function () {
            this.isDoShow=(!this.isDoShow);
        },
        deleteArticle:function () {
            var vm=this;
            axios.delete('/flwechat/public/article/' + vm.article_id)
                .then(function (response) {
                    console.log(response.data);
                    vm.isDoShow=false;
                    vm.article.is_deleted=1;
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
    },
    created: function () {
        this.article_id = GetQueryString('reply_id');
        this.userId = user_id;
        console.log(this.article_id, this.userId);
    },
    mounted: function () {
        this.getArticle();
        this.getArticleList();
    },
    updated: function () {
        var mySwiper = new Swiper('.swiper-container', {
            effect: 'coverflow',
            slidesPerView: 3,
            centeredSlides: true,
        });
    }
})