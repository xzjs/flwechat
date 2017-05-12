<template>
    <div class="your_action">
        <div v-if="is_comment" class="your_action_right">
            <a  :href="'article_detail.html?reply_id=' + my_article.reply_id">
                <img src="../assets/images/back_to_original.png" alt="">
                <span>原文</span>
            </a>
        </div>
        <div class="your_action_right" @click="support">
            <p v-if="my_article.is_support==0">赞<span>{{my_article.support_num}}</span></p>
            <p v-else style="color:#0084FF">赞<span>{{my_article.support_num}}</span></p>
        </div>
        <div class="your_action_right" @click="oppose()">
            <p v-if="my_article.is_oppose==0">踩<span>{{my_article.oppose_num}}</span></p>
            <p v-else style="color:#0084FF">踩<span>{{my_article.oppose_num}}</span></p>
        </div>
        <div class="your_action_right" @click="detail()">
            <p>评论<span>{{my_article.comment_num}}</span></p>
        </div>
        <template v-if="my_article.user_id!=userId">
            <div class="your_action_right" @click="follow()">
                <img v-if="my_article.is_follow==0" src="../assets/images/follow.png" alt="">
                <img v-else src="../assets/images/follow3.png" alt="">
            </div>
        </template>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import axios from 'axios';

    export default {
        props: {
            article:{},
            is_comment: {
                default: false
            }
        },
        computed:{
            my_article:function () {
                return this.article;
            },
            ...mapState(['userId'])
        },
        methods: {
            detail: function () {
                this.$router.push({ name: 'Detail', params: { id: this.article.id }});
            },
            support: function () {
                if (this.my_article.is_support == 0) {
                    this.my_article.is_support = 1;
                    this.my_article.support_num += 1;
                    axios.post('/flwechat/public/action',
                            {article_id: this.my_article.id, user_id: this.userId, type: 0})
                            .then(
                                    function (response) {
                                        console.log(response.data);
                                    }, function (response) {
                                        console.log(response.data);
                                    });
                } else {
                    this.my_article.is_support = 0;
                    this.my_article.support_num -= 1;
                    axios.post('/flwechat/public/action/cancel',
                            {article_id: this.my_article.id, user_id: this.userId, type: 0})
                            .then(
                                    function (response) {
                                        console.log(response.data);
                                    }, function (response) {
                                        console.log(response.data);
                                    });
                }
            },
            oppose: function () {
                if (this.my_article.is_oppose == 0) {
                    this.my_article.is_oppose = 1;
                    this.my_article.oppose_num += 1;
                    axios.post('/flwechat/public/action',
                            {article_id: this.my_article.id, user_id: this.userId, type: 1})
                            .then(
                                    function (response) {
                                        console.log(response.data);
                                    }, function (response) {
                                        console.log(response.data);
                                    });
                } else {
                    this.my_article.is_oppose = 0;
                    this.my_article.oppose_num -= 1;
                    axios.post('/flwechat/public/action/cancel',
                            {article_id: this.my_article.id, user_id: this.userId, type: 1})
                            .then(
                                    function (response) {
                                        console.log(response.data);
                                    }, function (response) {
                                        console.log(response.data);
                                    });
                }
            },
            follow: function () {
                if (this.my_article.is_follow == 0) {
                    this.my_article.is_follow = 1;
                    axios.post('/flwechat/public/follow',
                            {follow_user_id: this.userId, be_follow_id: this.my_article.id, type: 1})
                            .then(
                                    function (response) {
                                        console.log(response.data);
                                    }, function (response) {
                                        console.log(response.data);
                                    });
                } else {
                    this.my_article.is_follow = 0;
                    axios.post('/flwechat/public/follow/cancel_follow',
                            {follow_user_id: this.userId, be_follow_id: this.my_article.id, type: 1})
                            .then(
                                    function (response) {
                                        console.log(response.data);
                                    }, function (response) {
                                        console.log(response.data);
                                    });
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /*index操作按钮*/
    .your_action{
        width:100%;
        height:44px;
        padding:0 15px;
    }
    .your_action .your_action_right{
        padding: 0 8px;
        line-height: 44px;
        display: inline-block;
        text-align: center;
    }
    .your_action img{
        vertical-align: middle;
        width:16px;
        height:16px;
        margin-right: 2px;
    }
    .your_action span,.your_action p{
        font-size: 12px;
        color: #8a8a8a;
    }
    .your_action span{
        padding-left: 3px;
        color: inherit;
    }
</style>
