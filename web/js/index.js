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

    $.getJSON('/flwechat/public/article',function (result) {
        for(var i=0;i<result.length;i++){
            var html='<div class="content">'
                + '<img src="' + result[i].user.head_img + '" alt="" id="head_portrait">'
                + '<span id="wei_name">' + result[i].user.nickname + '</span>'
                + '<span id="topic">' + result[i].topic.content + '</span>'
                + '<p id="content_txt">' + result[i].content + '</p>'
                + '<div class="pic_show">' + html_img + '</div>'
                + '<div class="your_action">'
                // +'<div><img src="images/share.png" alt=""><span>'+result_?+'</span></div>'
                + '<div><img src="images/comment.png" alt=""><span>' + result[i].comment_num + '</span></div>'
                + '<div><img src="images/oppose.png" alt=""><span>' + result[i].oppose_num + '</span></div>'
                + '<div><img src="images/support.png" alt=""><span>' + result[i].support_num + '</span></div>'
                + '</div></div>';
        }
    })
});