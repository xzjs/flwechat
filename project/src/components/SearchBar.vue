<template>
    <div class="weui-search-bar" id="searchBar">
        <form class="weui-search-bar__form" @submit.prevent="search()">
            <div class="weui-search-bar__box">
                <i class="weui-icon-search"></i>
                <input type="search" class="weui-search-bar__input" id="searchInput" placeholder="搜索" required=""
                       v-model="keyWord">
                <a href="javascript:" class="weui-icon-clear" id="searchClear"></a>
            </div>
            <label class="weui-search-bar__label" id="searchText" @click="searchClick">
                <i class="weui-icon-search"></i>
                <span>搜索</span>
            </label>
        </form>
        <a href="javascript:" class="weui-search-bar__cancel-btn" id="searchCancel" @click="cancelSearch">取消</a>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';

    export default{
        data(){
            return {
                keyWord: null
            }
        },
        methods: {
            ...mapActions(['getArticles']),
            searchClick(){
                $('#searchBar').addClass('weui-search-bar_focusing');
                $('#searchInput').focus();
            },
            cancelSearch() {
                //hideSearchResult();
                $('#searchBar').removeClass('weui-search-bar_focusing');
                $('#searchText').show();
                $('#searchInput').blur();
            },
            search(){
                this.getArticles({key_word:this.keyWord});
                this.cancelSearch();
            }
        }
    }
</script>

<style scoped>

</style>