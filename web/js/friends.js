/**
 * Created by yanlli on 2017/2/10.
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

    var id=$.cookie('id');
    var data={'id':id,'type':0};
    $.post(
        "/flwechat/public/friend/get_friends",
        data,
        function (result) {
            var html='';
            for(var i=0;i<result.length;i++){
                html+='<a href="javascript:void(0);" onclick="detail('+result[i].id+')"><img src="'+result[i].head_img+'" alt="'+result[i].nickname+'" class="head_portrait"><span class="friend_name">'+result[i].nickname+'</span></a>';
            }
            $('#friend_list').html(html);
        },
        'json'
    );

    function detail(id) {

    }
});