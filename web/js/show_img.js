/**
 * Created by xzjs on 2017/2/19.
 */
function init_showimg() {
    var gallery = $("#gallery");
    if (gallery.length == 0) {
        var html = '<div class="weui-gallery" id="gallery">' +
            '<span class="weui-gallery__img correct" id="galleryImg" style="background-image: url()">' +
            '<div class="mark_img" style="background-image: url(\'images/red_circle.png\')">'+
            '<div class="galleryImgUser">' +
            '<img id="img_head_img" src="images/lan.jpg" alt="" class="galleryImgUserImg">' +
            '<span id="img_user_name">微信</span><span>-</span><span id="img_article_content">评论内容</span></div>' +
            // '<img src="images/left.png" alt="" class="galleryImgLeft">' +
            // '<img src="images/right.png" alt="" class="galleryImgRight">' +
            // '<img src="images/url.png" alt="" class="galleryImgUrl">' +
            // '<div id="img_expands" class="url_list" style="display: none"></div>' +
            // '<img src="images/close.png" alt="" class="galleryImgCenter">' +
            '<div id="danmu" class="galleryImgBulletScreen"></div>' +
            '</div></span>' +
            '<div class="opposite"><div class="" style="opacity: 0">'+
            '<div class="opposite-content">'+
            '<p>相关阅读</p>'+
            '<ul><li><a href="">扩展阅读1</a></li></ul>'+
            '</div><div class="turn_to_img"><img src="images/back_to_original.png" alt=""><span>返回</span></div>'+
            '<div class="ads_box"><div></div><img src="images/ads.jpg" alt=""></div>'+
            '</div></div>'+
            '<div class="bullet_screen">' +
            '<div class="bullet_screen_button">' +
            '<input type="checkbox" class="bullet_screen_button_checkbox" checked="checked">' +
            '<span>弹幕</span>' +
            '</div>' +
            '<img src="images/left2.png" alt="" class="galleryImgLeft">' +
            '<img src="images/right2.png" alt="" class="galleryImgRight">' +
            '<img src="images/url2.png" alt="" class="galleryImgUrl">' +
            // '<div id="img_expands" class="url_list" style="display: none"></div>' +
            '<img src="images/close2.png" alt="" class="galleryImgCenter">' +
            // '<div class="tucao_button">吐槽</div>'+
            '<span id="submit" class="bullet_screen_submit">吐槽</span>' +
            '<input id="danmu_text" type="text" placeholder="吐槽" class="bullet_screen_content" style="display: none">' +
            '</div></div>';
        $('body').append(html);

    }


    $('.galleryImgUrl').on('click', function () {
        $(".correct").removeClass('test2');
        $(".opposite").children().removeClass("test");
        $(".correct").addClass("test");
        $(".opposite").children().addClass('test2');
    });
    $('.turn_to_img').on('click',function(){
        $(".correct").removeClass("test");
        $(this).parent().removeClass('test2');
        $(".correct").addClass("test2");
        $(this).parent().addClass('test');
    });

    gallery = $("#gallery");
    $('.galleryImgCenter').on("click", function () {
        $(".correct").attr('class','weui-gallery__img correct');
        $(".opposite").children().removeClass();
        gallery.fadeOut(100);
        $('#danmu').danmu('danmu_stop');
        index = 0;
    });

    $('.bullet_screen_content').keydown(function (event) {
        if (event.keyCode == 13) {
            $(".bullet_screen_submit").click();
        }
    });

    $('#danmu_text').focus(function () {
        this.placeholder = '';
    });
    $('#danmu_text').blur(function () {
        this.placeholder = '吐槽';
    });

    $('.userImg').on('click', function () {
        var image_id = $(this).children('.img_show').data('id');
        $.getJSON('/flwechat/public/image/' + image_id, function (result) {
            img_data = result;
            for (var i = 0; i < img_data.length; i++) {
                if (img_data[i].id == image_id) {
                    index = i;
                    break;
                }
            }
            change_img(index);

            gallery.fadeIn(100);
            $('.mark_img').width($('.weui-gallery__img').width()-30);
            $('.mark_img').height($('.weui-gallery__img').height());
        });
    });

    $('.bullet_screen_button_checkbox').on('click', function () {
        if ($('.bullet_screen_button_checkbox').is(':checked')) {
            $('#danmu').show();
        } else {
            $('#danmu').hide();
        }
    });

    $('#submit').on('click', function () {
        var danmu_text=$('#danmu_text');
        if (danmu_text.css('display')=='none'){
            danmu_text.show();
            $('.bullet_screen_submit').css('border-top-left-radius','0');
            $('.bullet_screen_submit').css('border-bottom-left-radius','0');
        }else{
            if (danmu_text.val()!=''){
                var text = danmu_text.val();
                var time = $('#danmu').data("nowtime") + 5;
                $.post('/flwechat/public/comment',
                    {'image_id': img_data[index].id, 'user_id': user_id, 'comment': text},
                    function (result) {
                    });
                text_obj = '{ "text":"' + text + '","color":"' + getcolor() + '","size":"' + getsize() + '","position":"' + 0 + '","time":' + time + ',"isnew":""}';   //构造加上了innew属性的字符串danmu对象
                var new_obj = eval('(' + text_obj + ')');       //转化为js对象
                $('#danmu').danmu("add_danmu", new_obj);    //向插件中添加该danmu对象
                danmu_text.val('');  //清空用户输入框
            }else{
                $('#danmu_text').hide();
                $('.bullet_screen_submit').css('border-top-left-radius','5px');
                $('.bullet_screen_submit').css('border-bottom-left-radius','5px');
            }
        }
    });

    $('.galleryImgLeft').on('click', function () {
        change_img(index - 1);
    });

    $('.galleryImgRight').on('click', function () {
        change_img(index + 1);
    });

    // $('.galleryImgUrl').on('click', function () {
    //     if (img_data[index].expands.length != 0) {
    //         $('#img_expands').fadeToggle(100);
    //     } else {
    //         alert('图片没有相关的链接');
    //     }
    // })
}
var img_data = [];
var index = 0;

function change_img(num) {
    if (num < 0) {
        alert('已经是第一张了');
    } else if (num == img_data.length) {
        alert('已经是最后一张了');
    } else {
        index = num;
        $('#danmu').danmu('danmu_stop');
        $("#danmu").danmu('clear');
        //设置图片
        $('#galleryImg').css('background-image', 'url(/flwechat/public/storage/' + img_data[index].img + ')');
        $('.mark_img').css('background-image', 'url(/flwechat/public/storage/' + img_data[index].mark + ')');
        //设置弹幕
        for (var i = 0; i < img_data[index].comments.length; i++) {
            var text = '{"text":"' + img_data[index].comments[i].content + '","color":"' + getcolor() + '","size":"' + getsize() + '","position":"0","time":' + ((i + 1) * 5) + '}';
            // console.log(text);
            var new_obj = eval('(' + text + ')');
            $('#danmu').danmu("add_danmu", new_obj);
        }
        $('#danmu').danmu('danmu_start');
        //设置用户头像
        $('#img_head_img').attr('src', img_data[index].article.user.head_img);
        //设置用户名称
        $('#img_user_name').html(img_data[index].article.user.nickname);
        //设置文章内容
        $('#img_article_content').html(img_data[index].article.content);
        //设置链接
        var expands_html = '';
        for (var i = 0; i < img_data[index].expands.length; i++) {
            expands_html += '<li><a href="' + img_data[index].expands[i].href + '">' + img_data[index].expands[i].title + '</a></li>';
        }
        // $('#img_expands').html(expands_html);
        $('.opposite-content ul').html(expands_html);
    }
}

//        $("#danmu").danmu({
//            left: 0,    //区域的起始位置x坐标
//            top: 0,  //区域的起始位置y坐标
//            height: 360, //区域的高度
//            width: 640, //区域的宽度
//            zindex: 100, //div的css样式zindex
//            speed: 20000, //弹幕速度，飞过区域的毫秒数
//            sumtime: 900, //弹幕运行总时间
//            danmuss: {
//                1: [{"text": "hahahaha", "color": "red", "size": "0", "position": "0"},
//                    {"text": "233333", "color": "red", "size": "0", "position": "2"}],
//                3: [{"text": "poi", "color": "red", "size": "1", "position": "1"},
//                    {"text": "2333", "color": "#FFFFFF", "size": "0", "position": "0"}],
//                50: [{"text": "XXX真好", "color": "#FFFFFF", "size": "0", "position": "2"},]
//            }, //danmuss对象，运行时的弹幕内容
//            default_font_color: "#FFFFFF", //弹幕默认字体颜色
//            font_size_small: 16, //小号弹幕的字体大小,注意此属性值只能是整数
//            font_size_big: 24, //大号弹幕的字体大小
//            opacity: "0.9", //弹幕默认透明度
//            top_botton_danmu_time: 6000 //顶端底端弹幕持续时间
//        });

//获取颜色的随机函数
function getcolor() {
    var colors = ['white', 'red', 'green', 'blue', 'yellow'];
    var i = Math.floor(Math.random() * 5);
    return colors[i];
}

//获取字号的随机函数
function getsize() {
    return Math.round(Math.random());
}
$('.galleryImgUser').on('click', function () {
    $(this).css('height', 'auto')
});

function bandImageClick(id) {
    image_id=id;
    if(image_id==null) {
        var image_id = $(this).data('id');
    }
    $.getJSON('/flwechat/public/image/' + image_id, function (result) {
        img_data = result;
        for (var i = 0; i < img_data.length; i++) {
            if (img_data[i].id == image_id) {
                index = i;
                break;
            }
        }
        change_img(index);

        $("#gallery").fadeIn(100);
    });
}
