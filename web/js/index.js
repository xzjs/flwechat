/**
 * Created by yanlli on 2017/1/16.
 */
$(function () {
    var topic_id = GetQueryString('id');
    if (topic_id == null) {
        getArticleList('/flwechat/public/article/article_list/0');
    } else {
        getArticleList('/flwechat/public/article/get_article_by_topic/' + topic_id);

        $('div[data-id="' + topic_id + '"]').addClass('topic_index_selected').siblings('.topic_index').removeClass('topic_index_selected');
    }
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

function getTopicList() {
    $.getJSON('/flwechat/public/topic', function (result) {
        var topicList = ''
        for (var i = 0; i < result.length; i++) {
            topicList += '<a href="index.html?id=' + result[i].id + '" class="topic_index" data-id="' + result[i].id + '">' + result[i].content + '</a>'
        }
        $('.topic_index_box').append(topicList);
        var topic_id = GetQueryString('id');
        if (topic_id != null) {
            $('a[data-id="' + topic_id + '"]').addClass('topic_index_selected').siblings('.topic_index').removeClass('topic_index_selected');
        }
        // $('.topic_index').on('click',function () {
        //     $(this).addClass('topic_index_selected').siblings('.topic_index').removeClass('topic_index_selected');
        //     getArticleList('/flwechat/public/article/get_article_by_topic/'+$(this).data('id'));
        // });
    });
}

$('#searchInput').keydown(function (event) {
    if (event.keyCode == 13) {
        $.post('/flwechat/public/article/search',
            {'keyword': $('#searchInput').val(),},
            function (result) {
                showArticleList(result);
            }, 'json');
    }
});


