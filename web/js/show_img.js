/**
 * Created by xzjs on 2017/2/19.
 */

var image_id = GetQueryString('image_id');
if (image_id == null) {
    console.log('参数错误');
}

// function init_showimg() {
//     $('.weui-gallery').on('click',function () {
//         // $('.bullet_screen').toggle(500);
//         // $('.bullet_screen').fadeIn(500);
//         // setTimeout("$('.bullet_screen').fadeOut(500)",5000);
//     });
//     // setTimeout("$('.bullet_screen').fadeOut(500)",3000);
//     $('.mark_img').height($('.weui-gallery__img').height());
//     $.getJSON('/flwechat/public/image/' + image_id, function (result) {
//         img_data = result;
//         for (var i = 0; i < img_data.length; i++) {
//             if (img_data[i].id == image_id) {
//                 index = i;
//                 break;
//             }
//         }
//         change_img(index);
//     });
//     flag = 1;
//     console.log(flag);
//     $('.galleryImgUrl img').attr('src', 'images/url2.png');
//     $('.galleryImgUrl').on('click', function () {
//         change_icon();
//     });
//
//     var turn = GetQueryString('turn');
//     if (turn != null) {
//         $('.galleryImgUrl').click();
//     }
//
//     var gallery = $("#gallery");
//     $('.galleryImgCenter').on("click", function () {
//         window.location.href = $.cookie('back');
//     });
//
//     $('.bullet_screen_content').keydown(function (event) {
//         if (event.keyCode == 13) {
//             $(".bullet_screen_submit").click();
//         }
//     });
//
//     $('.galleryImgLeft').on('click', function () {
//         change_img(index - 1);
//     });
//
//     $('.galleryImgRight').on('click', function () {
//         change_img(index + 1);
//     });
// }
// var img_data = [];
// var index = 0;
// var flag = 1;
// function change_img(num) {
//     if (num < 0) {
//         alert('已经是第一张了');
//     } else if (num == img_data.length) {
//         alert('已经是最后一张了');
//     } else {
//         index = num;
//         $('#danmu').danmu('danmu_stop');
//         $("#danmu").danmu('clear');
//         //设置图片
//         $('#galleryImg').css('background-image', 'url(/flwechat/public/storage/' + img_data[index].img + ')');
//         $('.mark_img').css('background-image', 'url(/flwechat/public/storage/' + img_data[index].mark + ')');
//         //设置弹幕
//         for (var i = 0; i < img_data[index].comments.length; i++) {
//             var text = '{"text":"' + img_data[index].comments[i].content + '","color":"' + getcolor() + '","size":"' + getsize() + '","position":"0","time":' + ((i + 1) * 5) + '}';
//             // console.log(text);
//             var new_obj = eval('(' + text + ')');
//             $('#danmu').danmu("add_danmu", new_obj);
//         }
//         $('#danmu').danmu('danmu_start');
//         //设置用户头像
//         $('#img_head_img').attr('src', img_data[index].article.user.head_img);
//         //设置用户名称
//         $('#img_user_name').html(img_data[index].article.user.nickname);
//         //设置文章内容
//         $('#img_article_content').html(img_data[index].article.content);
//         //设置链接
//         var expands_html = '';
//         for (var i = 0; i < img_data[index].expands.length; i++) {
//             expands_html += '<li ';
//             if (img_data[index].expands[i].dimension == 'variant' || img_data[index].expands[i].dimension == 'implicit') {
//                 expands_html += 'class="expands_li_background_color"';
//             }
//             expands_html += '><a href="' + img_data[index].expands[i].href + '"><p class="expands_title">';
//
//                 expands_html += img_data[index].expands[i].title;
//
//             expands_html += '</p><p class="expands_abstract">' + img_data[index].expands[i].abstract + '</p></a></li>';
//         }
//         // $('#img_expands').html(expands_html);
//         $('.opposite-content ul').append(expands_html);
//     }
// }

// $('.galleryImgUser').on('click', function () {
//     $(this).css('height', 'auto')
// });

// $(function () {
//     init_showimg();
// });
// var opposite = $(".opposite"), correct = $(".correct");
// function change_icon() {
//     if (flag == 1) {
//         opposite.children().children().css('display', 'block');
//         correct.removeClass('test2');
//         opposite.children().removeClass("test");
//         correct.addClass("test");
//         opposite.children().addClass('test2');
//         setTimeout(function () {
//             $('.galleryImgUrl img').attr('src', 'images/back_to_original2.png');
//         }, 375);
//
//
//         //修改地址栏历史
//         var turn = GetQueryString('turn');
//         if (turn == null) {
//             history.pushState({}, "扩展", window.location.href + '&turn=true');
//         }
//         flag = 0;
//     } else {
//         correct.removeClass("test");
//         opposite.children().removeClass('test2');
//         correct.addClass("test2");
//         opposite.children().addClass('test');
//
//         setTimeout(function () {
//             $('.galleryImgUrl img').attr('src', 'images/url2.png');
//         }, 375);
//         setTimeout(function () {
//             opposite.children().children().css('display', 'none');
//         }, 750);
//         // opposite.children().css('display','none');
//
//         //修改地址栏历史
//         var href = window.location.href.split('&')[0];
//         history.pushState({}, "图片展示", href);
//         flag = 1;
//     }
// }

var turn = GetQueryString('turn');
Vue.config.devtools = true;

var action = Vue.extend({
    template: `<div class="your_action">
                <div class="your_action_right" @click="support">
                    <p v-if="article.is_support==0">赞<span>{{article.support_num}}</span></p>
                    <p v-else style="color:#0084FF">赞<span>{{article.support_num}}</span></p>
                </div>
                <div class="your_action_right" @click="oppose()">
                    <p v-if="article.is_oppose==0">踩<span>{{article.oppose_num}}</span></p>
                    <p v-else style="color:#0084FF">踩<span>{{article.oppose_num}}</span></p>
                </div>
                <div class="your_action_right" @click="detail()">
                    <p>评论<span>{{article.comment_num}}</span></p>
                </div>             
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

var app = new Vue({
    el: '#app',
    data: {
        imageId: image_id,
        images: [],
        index: 0,
        userId: user_id,
        flag: 1,
        isTurn:turn,
        classActive:[]
    },
    components: {
        action
    },
    mounted: function () {
        this.getImages();
    },
    methods: {
        getImages: function () {
            var vm = this;
            axios.post('/flwechat/public/image/get_image', {id: vm.imageId, user_id: vm.userId})
                .then(function (response) {
                    console.log(response.data);
                    vm.images = response.data;
                    for (var i = 0; i < vm.images.length; i++) {
                        if (vm.images[i].id == vm.imageId) {
                            vm.index = i;
                            break;
                        }
                    }
                    vm.changeIndex(0);
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        changeIndex: function (increment) {
            if (increment < 0 && this.index == 0) {
                alert("已经是第一张了");
                return;
            }
            if (increment > 0 && this.index == this.images.length - 1) {
                alert("已经是最后一张了");
                return;
            }
            this.index += increment;
            this.classActive=[];
            var expands=this.images[this.index].expands;
            for(var i=0;i<expands.length;i++){
                this.classActive[i]=(expands[i].dimension=='variant'||expands[i].dimension=='implicit');
            }
        },
        close: function () {
            window.location.href = $.cookie('back');
        },
        changeIcon: function () {
            var opposite = $(".opposite"), correct = $(".correct");
            if (this.flag == 1) {
                opposite.children().children().css('display', 'block');
                correct.removeClass('test2');
                opposite.children().removeClass("test");
                correct.addClass("test");
                opposite.children().addClass('test2');
                setTimeout(function () {
                    $('.galleryImgUrl img').attr('src', 'images/back_to_original2.png');
                }, 375);
                //修改地址栏历史
                var turn = GetQueryString('turn');
                if (turn == null) {
                    history.pushState({}, "扩展", window.location.href + '&turn=true');
                }
                this.flag = 0;
            } else {
                correct.removeClass("test");
                opposite.children().removeClass('test2');
                correct.addClass("test2");
                opposite.children().addClass('test');

                setTimeout(function () {
                    $('.galleryImgUrl img').attr('src', 'images/url2.png');
                }, 375);
                setTimeout(function () {
                    opposite.children().children().css('display', 'none');
                }, 750);
                // opposite.children().css('display','none');

                //修改地址栏历史
                var href = window.location.href.split('&')[0];
                history.pushState({}, "图片展示", href);
                this.flag = 1;
            }
        }
    },
    updated: function () {
        $('.mark_img').height($('.weui-gallery__img').height());
        if (this.isTurn == 'true') {
            this.changeIcon();
            console.log("执行了");
        }
    }
});