<template>
    <div v-cloak class="container">
        <div class="article_box">
            <div class="content">
                <div class="content_top">
                    <a :href="'mine.html?user_id='+article.user.id">
                        <img :src="article.user.head_img" alt="" class="head_portrait"><span
                            class="wei_name">{{article.user.nickname}}&bull;<span>{{article.topic.content}}</span></span>
                    </a>
                    <span v-if="article.user.id==userId" class="do_icon" style="float: right;" @click="changeDo">
                <img class="do_open" src="images/down.png" alt="">
            </span>
                </div>
                <div v-if="article.is_deleted==0">
                    <p id="article_content" class="content_txt">{{article.content}}</p>
                    <images :images="article.images"></images>
                </div>
                <p v-else class="content_txt">该文章已被作者删除</p>
                <action :article="article"></action>
            </div>
            <div class="comment_box comment_bg" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
                <articles :article="item" v-for="item in articles" :is_comment="true" :key="item.id"></articles>
            </div>
            <div class="comment_input">
                <router-link :to="{name:'Publish',params:{id:articleId}}">评论</router-link>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import articles from '@/components/Article';
    import action from  '@/components/Action';
    import images from  '@/components/Image';
    import {mapState, mapActions, mapMutations} from 'vuex';

    export default{
        data() {
            return {
                article_list: [],
                articleId: 0,
                isDoShow: false
            }
        },
        computed: mapState(['userId', 'articles', 'article', 'currentPage', 'nextPage']),
        components: {
            articles, action, images
        },
        methods: {
            ...mapMutations(['setCurrentPage', 'setNextPage']),
            ...mapActions(['getArticle', 'getArticles']),
            loadMore(){
                if (this.nextPage != null) {
                    this.getArticles({reply_id: this.articleId, page: this.nextPage});
                }
            },
            changeDo: function () {
                this.isDoShow = (!this.isDoShow);
            },
            deleteArticle: function () {
                var vm = this;
                axios.delete('/flwechat/public/article/' + vm.article_id)
                        .then(function (response) {
                            vm.isDoShow = false;
                            vm.article.is_deleted = 1;
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
            }
        },
        mounted() {
            this.setCurrentPage(1);
            this.setNextPage(null);
            this.articleId = this.$route.params.id;
            this.getArticle({id: this.articleId});
            this.getArticles({reply_id: this.articleId, page: this.currentPage});
        },
//        watch: {
//            '$route'(to, from){
//                this.setCurrentPage(1);
//                this.setNextPage(null);
//                this.getArticle();
//                this.getArticleList();
//            }
//        }
    }
</script>

<style lang="scss" rel="stylesheet/scss"  scoped>
    .container {
        padding-bottom: 84px;
    }

    .do_icon {
        text-align: center;
        width: 45px;
        margin-right: -15px;
    }

    .article_do a {
        text-align: left;
        height: 35px;
        line-height: 35px;
        display: block;
        /*vertical-align: middle;*/
        border-bottom: 1px solid #e8e8e8;
    }

    .article_do a img {
        position: relative;
        top: 6px;
        padding: 0 22px;
    }

    .comment_input {
        position: fixed;
        right: 15px;
        bottom: 65px;
    }

    .comment_input a {
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        display: inline-block;
        border-radius: 20px;
        background-color: #0084FF;
        color: #fff;
    }

    .head_portrait {
        width: 20px;
        height: 20px;
        border-radius: 10px;
        vertical-align: middle;
    }

    .content {
        /*padding:0 15px;*/
        border-bottom: 6px solid #e8e8e8;
        background-color: #fff;
        overflow: hidden;
    }

    .content_top {
        padding: 0 15px;
        position: relative;
        height: 30px;
        line-height: 30px;
    }

    .content_txt {
        padding: 0 15px;
        font-size: 18px;
        line-height: 32px;
    }

    .comment_bg {
        background-color: #f5f5f5;
        border-bottom: 1px solid #e8e8e8;
    }

    .comment_box{
        .content{
            background-color: #f5f5f5;
            border-bottom: 1px solid  #e8e8e8;
            .wei_name{
                font-size: 14px;
            }
            .pic_show .userImg{
                width: 60px;
            }
            .head_portrait{
                width:20px;
                height:20px;
                border-radius: 10px;
                vertical-align: middle;
            }
        }
    }
    .comment_input{
        position: fixed;
        right:15px;
        bottom: 65px;
    }
    .comment_input a{
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        display: inline-block;
        border-radius: 20px;
        background-color: #0084FF;
        color: #fff;
    }
</style>