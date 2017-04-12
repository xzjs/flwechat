<template>
    <div class="container">
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
            <router-link v-for="item in topics" :to="{name:'Index',params:{topic_id:item.id}}" class="topic_index">
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
    import {mapState} from 'vuex';

    export default{
        data: function () {
            return {
                topic_id: 0,
            }
        },
        computed: mapState([
            'topics', 'userId','articles'
        ]),
        created: function () {
            this.getTopics();
            this.getArticles();
        },
        methods: {
            getTopics(){
                this.$store.dispatch('getTopics')
            },
            getArticles(){
                this.topic_id = this.$route.params.topic_id;
                if(this.topic_id==null){
                    this.topic_id=0;
                }
                console.log(this.topic_id);
                var postData = {
                    page: 0,
                    size: 15,
                    user_id:this.userId,
                    reply_id:0,
                    topic_id:this.topic_id
                };
                this.$store.dispatch('getArticles',postData)
            }
        },
        components: {
            articles
        },
        watch: {
            '$route'(to, from){
                this.getArticles();
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
        border-bottom:2px solid #0084FF;
    }
</style>