<template>
    <div>
        <search></search>
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
        <div class="content_box" v-infinite-scroll="loadMore"
             infinite-scroll-disabled="loading"
             infinite-scroll-distance="10"
             infinite-scroll-immediate-check="false">
            <articles :article="item" v-for="item in articles" :key="item.id"></articles>
        </div>
    </div>
</template>

<script>
    import articles from '@/components/Article';
    import search from '@/components/SearchBar';
    import {mapState, mapMutations, mapActions} from 'vuex';

    export default{
        data() {
            return {
                topicId: 0,
                value:''
            }
        },
        computed: mapState(['topics', 'articles', 'currentPage', 'nextPage']),
        methods: {
            ...mapMutations(['setCurrentPage', 'setTotalPage']),
            ...mapActions(['getArticles']),
            getTopicId(){
                var id = this.$route.params.topic_id;
                if (id != null) {
                    this.topicId = id;
                } else {
                    this.topicId = 0;
                }
            },
            loadMore(){
                console.log('hello');
                if (this.nextPage!=null) {
                    this.getArticles({topic_id: this.topicId, page: this.nextPage});
                }
            },
            search(){

            }
        },
        components: {articles,search},
        mounted(){
            this.getTopicId();
            this.getArticles({topic_id: this.topicId});
        },
        watch: {
            '$route'(to, from){
                this.setCurrentPage(1);
                this.getTopicId();
                this.getArticles({topic_id: this.topicId});
            }
        }
    }
</script>

<style scoped>
    .content_box {
        overflow: hidden;
        margin-bottom: 53px;
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
        /*padding: 0px 10px;*/
        width:20%;
        margin-right: -2px;
    }
    .router-link-active {
        color: #0084FF;
        border-bottom: 2px solid #0084FF;
    }

    .search{
        width: 100%;
        position: fixed;
        top: 0;
    }
</style>
