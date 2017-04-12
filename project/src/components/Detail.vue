<template>
    <div class="container">
        <div class="article_box">
            <div v-cloak class="content">
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
            <div class="comment_box">
                <articles :article_list="articles"></articles>
            </div>
            <div class="comment_input">
                <a :href="'publish.html?reply_id='+article.id">评论</a>
            </div>
        </div>
    </div>
</template>

<script>
    import articles from '@/components/Article';
    import action from  '@/components/Action';
    import images from  '@/components/Image';
    import {mapState} from 'vuex';
    import axios from 'axios';

    export default{
        data: function(){
            return{
                article: null,
                article_list: [],
                article_id: 0,
                userId: 0,
                isDoShow: false
            }
        },
        computed: mapState(['userId', 'articles']),
        components: {
            articles, action,images
        },
        methods: {
            getArticle: function () {
                var articleId = this.$route.params.id;
                var vm = this;
                axios.post('/flwechat/public/article/get_article',
                        {article_id: articleId, user_id: vm.userId})
                        .then(
                                function (response) {
                                    vm.article = response.data;
                                }
                        ).catch(
                        function (error) {
                            console.log(error);
                        }
                )
            },
            getArticleList: function () {
                var articleId = this.$route.params.id;
                var postData = {
                    page: 0,
                    size: 15,
                    user_id:this.userId,
                    reply_id:articleId
                };
                this.$store.dispatch('getArticles',postData);
            },
            changeDo: function () {
                this.isDoShow = (!this.isDoShow);
            },
            deleteArticle: function () {
                var vm = this;
                axios.delete('/flwechat/public/article/' + vm.article_id)
                        .then(function (response) {
                            console.log(response.data);
                            vm.isDoShow = false;
                            vm.article.is_deleted = 1;
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
            }
        },
        mounted: function () {
            this.getArticle();
            this.getArticleList();
        },
        watch: {
            '$route'(to, from){
                this.getArticle();
                this.getArticles();
            }
        }
    }
</script>

<style scoped>
    .container{
        padding-bottom:84px;
    }
    .do_icon {
        text-align: center;
        width: 45px;
        margin-right:-15px;
    }
    .article_do a{
        text-align: left;
        height:35px;
        line-height:35px;
        display: block;
        /*vertical-align: middle;*/
        border-bottom: 1px solid #e8e8e8;
    }
    .article_do a img{
        position: relative;
        top:6px;
        padding:0 22px;
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
    .head_portrait{
        width:20px;
        height:20px;
        border-radius: 10px;
        vertical-align: middle;
    }
</style>