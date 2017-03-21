/**
 * Created by yanlli on 2017/1/16.
 */
$(function () {
    getTopicList();
});
$('.more').on('click', function () {
    $('.more').hide();
    $('.close').show();
    $('.topic_index_box').css('height', '120px');
    // $('')
    // var i=0;
    // $('.topic_index img').on('click',function () {
    //     if (i<3){
    //         $(this).attr('src','images/choose.png');
    //         $(this).parent().siblings().data('id','1');
    //         //设置data-id
    //         console.log($(this).parent().siblings().data());
    //         var top_topic_index=$(this).parent().siblings().html();
    //         $('.recommend').after('<span class="top_topic_index">'+top_topic_index+'</span>');
    //         i++;
    //     }else{
    //         alert('最多选择3个标签');
    //         return
    //     }
    // });
});
$('.close').on('click', function () {
    $('.more').show();
    $('.close').hide();
    $('.topic_index_box').css('height', '30px');
});

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

