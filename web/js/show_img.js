/**
 * Created by xzjs on 2017/2/19.
 */
function init_showimg() {
    var html = '<div class="weui-gallery" id="gallery">' +
        '<span class="weui-gallery__img" id="galleryImg" style="background-image: url()">' +
        '<img src="images/left.png" alt="" class="galleryImgLeft">' +
        '<img src="images/right.png" alt="" class="galleryImgRight">' +
        '<img src="images/url.png" alt="" class="galleryImgUrl">' +
        '<img src="images/close.png" alt="" class="galleryImgCenter">' +
        '<div id="danmu" class="galleryImgBulletScreen"></div>' +
        '</span>' +
        '<div class="bullet_screen">' +
        '<div class="bullet_screen_button">' +
        '<input type="checkbox" class="bullet_screen_button_checkbox" checked="checked">' +
        '<span>弹幕</span>' +
        '</div>' +
        '<span id="submit" class="bullet_screen_submit">提交</span>' +
        '<input id="danmu_text" type="text" placeholder="吐槽" class="bullet_screen_content">' +
        '</div></div>';
    $('body').append(html);
    var $gallery = $("#gallery");
    $('.galleryImgCenter').on("click", function () {
        $gallery.fadeOut(100);
        $('#danmu').danmu('danmu_stop');
        index = 0;
    });

    $('.bullet_screen_content').keydown(function (event) {
        if(event.keyCode==13){
            $(".bullet_screen_submit").click();
        }
    });

    $('#danmu_text').focus(function () {
        this.placeholder='';
    });
    $('#danmu_text').blur(function () {
        this.placeholder='吐槽';
    });

    $('.img_show').on('click', function () {
        var image_id = $(this).data('id');
        $.getJSON('/flwechat/public/image/' + image_id, function (result) {
            img_data = result;
            for(var i=0;i<img_data.length;i++){
                if(img_data[i].id==image_id){
                    index=i;
                    break;
                }
            }
            change_img(index);

            $gallery.fadeIn(100);
        });
    });

    $('.bullet_screen_button_checkbox').on('click', function () {
        if ($('.bullet_screen_button_checkbox').is(':checked')) {
            $('#danmu').show();
        }else{
            $('#danmu').hide();
        }
    });

    $('#submit').on('click', function () {
        var text = $('#danmu_text').val();
        var time = $('#danmu').data("nowtime") + 5;
        $.post('/flwechat/public/comment',
            {'image_id': img_data[index].id, 'user_id': user_id, 'comment': text},
            function (result) {
                console.log(result);
            });
        //以上部分为从页面空间中获取用户输入的弹幕内容及选择的颜色等选项
//            var text_obj = '{ "text":"' + text + '","color":"' + color + '","size":"' + size + '","position":"' + position + '","time":' + time + '}';    //构造字符串形式的弹幕对象
//            if (url_to_post_danmu)    //url_to_post_danmu 为接受推送的后端地址
//                jQuery.post(url_to_post_danmu, {
//                    danmu: text_obj
//                });       //向服务器推送danmu对象的字符串形式
        text_obj = '{ "text":"' + text + '","color":"' + getcolor() + '","size":"' + getsize() + '","position":"' + 0 + '","time":' + time + ',"isnew":""}';   //构造加上了innew属性的字符串danmu对象
        var new_obj = eval('(' + text_obj + ')');       //转化为js对象
        $('#danmu').danmu("add_danmu", new_obj);    //向插件中添加该danmu对象
        $('#danmu_text').val('');  //清空用户输入框
    });

    $('.galleryImgLeft').on('click', function () {
        change_img(index-1);
    });

    $('.galleryImgRight').on('click', function () {
        change_img(index+1);
    });

    $('.galleryImgUrl').on('click', function () {
        if (img_data[index].url != '') {
            window.location.href = img_data[index].url;
        } else {
            alert('图片没有相关的链接');
        }
    })
}
var img_data = [];
var index = 0;

function change_img(num) {
    if (num < 0) {
        alert('已经是第一张了');
    } else if (num == img_data.length) {
        alert('已经是最后一张了');
    } else {
        index=num;
        $('#danmu').danmu('danmu_stop');
        $("#danmu").danmu('clear');
        $('#galleryImg').css('background-image', 'url(/flwechat/public/storage/' + img_data[index].img + ')');
        for (var i = 0; i < img_data[index].comments.length; i++) {
            var text = '{"text":"' + img_data[index].comments[i].content + '","color":"' + getcolor() + '","size":"' + getsize() + '","position":"0","time":' + ((i + 1) * 5) + '}';
            console.log(text);
            var new_obj = eval('(' + text + ')');
            $('#danmu').danmu("add_danmu", new_obj);
        }
        $('#danmu').danmu('danmu_start');
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
