<template>
    <div>
        <div class="weui-search-bar" id="searchBar">
            <form class="weui-search-bar__form" onsubmit="return check()">
                <div class="weui-search-bar__box">
                    <i class="weui-icon-search"></i>
                    <input type="search" class="weui-search-bar__input" id="searchInput" placeholder="搜索" required="">
                    <a href="javascript:" class="weui-icon-clear" id="searchClear"></a>
                </div>
                <label class="weui-search-bar__label" id="searchText">
                    <i class="weui-icon-search"></i>
                    <span>搜索</span>
                </label>
            </form>
            <a href="javascript:" class="weui-search-bar__cancel-btn" id="searchCancel">取消</a>
        </div>
        <nav class="topic_index_box">
            <router-link to="0" class="topic_index recommend">全部</router-link>
            <router-link v-for="item in topics" :key="item.id" :to="{name:'Index',params:{topic_id:item.id}}"
                         class="topic_index">
                {{item.content}}
            </router-link>
        </nav>
        <!--<div class="more_topic">-->
        <!--<img src="../../static/images/more.png" alt="" class="more">-->
        <!--<img src="../../static/images/up_close.png" alt="" class="close" style="display: none">-->
        <!--</div>-->
        <articles :article_list="articles"></articles>
    </div>
</template>

<script>
    import articles from '@/components/Article';
    import {mapState, mapActions} from 'vuex';

    export default{
        data: function () {
            return {
                topicId: 0
            }
        },
        computed: mapState(['topics', 'articles']),
        methods: {
            ...mapActions(['getArticles'])
        },
        components: {
            articles
        },
        mounted(){
            var id = this.$route.params.topic_id;
            if (id != null) {
                this.topicId = id;
            }
            this.getArticles({topic_id:this.topicId});
        },
        watch: {
            '$route'(to, from){
                this.getArticles({topic_id:this.topicId});
            }
        }
    }
</script>

<style scoped>
    .container {
        /*background-color: #fff;*/
        padding-bottom: 84px;
    }

    .weui-search-bar {
        width: 100%;
        position: fixed;
        top: 0;
        z-index: 100;
    }

    .topic_index_box {
        background-color: #f8f8f8;
        height: 30px;
        line-height: 28px;
        margin-top: 44px;
        overflow: hidden;
    }

    .topic_index {
        display: inline-block;
        text-align: center;
        padding: 0px 10px;
    }

    .router-link-active {
        color: #0084FF;
        border-bottom: 2px solid #0084FF;
    }
</style>