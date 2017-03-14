/**
 * Created by xzjs on 2017/2/19.
 */
function init_showimg() {
    var image_id=GetQueryString('image_id');
    if(image_id==null) {
        console.log('参数错误');
        return;
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
    });

    $('.galleryImgUrl').on('click', function () {
        $(".correct").removeClass('test2');
        $(".opposite").children().removeClass("test");
        $(".correct").addClass("test");
        $(".opposite").children().addClass('test2');

        //修改地址栏历史
        var turn=GetQueryString('turn');
        if(turn==null){
            history.pushState({},"扩展",window.location.href+'&turn=true');
        }
    });

    var turn=GetQueryString('turn');
    if(turn!=null){
        $('.galleryImgUrl').click();
    }

    $('.turn_to_img').on('click',function(){
        $(".correct").removeClass("test");
        $(this).parent().removeClass('test2');
        $(".correct").addClass("test2");
        $(this).parent().addClass('test');

        //修改地址栏历史
        var href=window.location.href.split('&')[0];
        history.pushState({},"图片展示",href);
    });

    var gallery = $("#gallery");
    $('.galleryImgCenter').on("click", function () {
        // $(".correct").attr('class','weui-gallery__img correct');
        // $(".opposite").children().removeClass();
        // gallery.fadeOut(100);
        // $('#danmu').danmu('danmu_stop');
        // index = 0;
        window.location.href=$.cookie('back');
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

    // $('.userImg').on('click', function () {
    //     var image_id = $(this).children('.img_show').data('id');
    //     $.getJSON('/flwechat/public/image/' + image_id, function (result) {
    //         img_data = result;
    //         for (var i = 0; i < img_data.length; i++) {
    //             if (img_data[i].id == image_id) {
    //                 index = i;
    //                 break;
    //             }
    //         }
    //         change_img(index);
    //
    //         gallery.fadeIn(100);
    //         $('.mark_img').width($('.weui-gallery__img').width());
    //         $('.mark_img').height($('.weui-gallery__img').height());
    //     });
    // });

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

$(function () {
    init_showimg();
})


