/**
 * Created by yanlli on 2017/1/16.
 */
$(function () {
    var $searchBar = $('#searchBar'),
        $searchResult = $('#searchResult'),
        $searchText = $('#searchText'),
        $searchInput = $('#searchInput'),
        $searchClear = $('#searchClear'),
        $searchCancel = $('#searchCancel');

    function hideSearchResult() {
        $searchResult.hide();
        $searchInput.val('');
    }

    function cancelSearch() {
        hideSearchResult();
        $searchBar.removeClass('weui-search-bar_focusing');
        $searchText.show();
    }

    $searchText.on('click', function () {
        $searchBar.addClass('weui-search-bar_focusing');
        $searchInput.focus();
    });
    $searchInput
        .on('blur', function () {
            if (!this.value.length) cancelSearch();
        })
        .on('input', function () {
            if (this.value.length) {
                $searchResult.show();
            } else {
                $searchResult.hide();
            }
        })
    ;
    $searchClear.on('click', function () {
        hideSearchResult();
        $searchInput.focus();
    });
    $searchCancel.on('click', function () {
        cancelSearch();
        $searchInput.blur();
    });
    var topic_id=GetQueryString('id');
    if(topic_id==null){
        getArticleList('/flwechat/public/article/article_list/0');
    }else{
        getArticleList('/flwechat/public/article/get_article_by_topic/'+topic_id);
    }
});
$('.more').on('click', function () {
    $('.more').hide();
    $('.close').show();
    $('.topic_index_box').css('height','320px');
    $('')
    var i=0;
    $('.topic_index img').on('click',function () {
        if (i<3){
            $(this).attr('src','images/choose.png');
            $(this).parent().siblings().data('id','1');
            //设置data-id
            console.log($(this).parent().siblings().data());
            var top_topic_index=$(this).parent().siblings().html();
            $('.recommend').after('<span class="top_topic_index">'+top_topic_index+'</span>');
            i++;
        }else{
            alert('最多选择3个标签');
            return
        }
    });
});
$('.close').on('click',function () {
    $('.more').show();
    $('.close').hide();
    $('.topic_index_box').css('height','35px');
});
$('.topic_index_index').on('click',function () {
    $(this).addClass('top_topic_index_selected').siblings().removeClass('top_topic_index_selected');
});



