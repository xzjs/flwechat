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

    function getArticleList() {
        $.getJSON('/flwechat/public/article', function (result) {
            showArticleList(result);
        })
    }

    function showArticleList(result) {
        var myPublish = $('.content_box');
        $('.blank').remove();
        for (var i = 0; i < result.length; i++) {
            var html_img = '';
            for (var j = 0; j < result[i].images.length; j++) {
                html_img += '<div class="userImg"><img src="/flwechat/public/storage/' + result[i].images[j].img+ '" alt=""></div>';
            }
            var html = '<div class="content">'
                + '<img src="' + result[i].user.head_img + '" alt="" class="head_portrait">'
                + '<span class="wei_name">' + result[i].user.nickname + '</span>'
                + '<span class="topic">' + result[i].topic.content + '</span>'
                + '<p class="content_txt">' + result[i].content + '</p>'
                + '<div class="pic_show">' + html_img + '</div>'
                + '<div class="your_action">'
                // +'<div><img src="images/share.png" alt=""><span>'+result_?+'</span></div>'
                + '<div><img src="images/comment.png" alt=""><span>' + result[i].comment_num + '</span></div>'
                + '<div><img src="images/oppose.png" alt=""><span>' + result[i].oppose_num + '</span></div>'
                + '<div><img src="images/support.png" alt=""><span>' + result[i].support_num + '</span></div>'
                + '</div></div>';
            myPublish.append(html);
        }
    }

    getArticleList();
});