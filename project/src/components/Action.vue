<template>
    <div class="your_action">
        <div v-if="!is_comment && myArticle.reply_id!=0" class="your_action_right">
            <a :href="'article_detail.html?reply_id=' + myArticle.reply_id">
                <img src="../assets/images/back_to_original.png" alt="">
                <span>原文</span>
            </a>
        </div>
        <div class="your_action_right" @click="support">
            <p v-if="myArticle.is_support==0">赞<span>{{myArticle.support_num}}</span></p>
            <p v-else style="color:#0084FF">赞<span>{{myArticle.support_num}}</span></p>
        </div>
        <div class="your_action_right" @click="oppose()">
            <p v-if="myArticle.is_oppose==0">踩<span>{{myArticle.oppose_num}}</span></p>
            <p v-else style="color:#0084FF">踩<span>{{myArticle.oppose_num}}</span></p>
        </div>
        <div class="your_action_right" @click="detail()">
            <p>评论<span>{{myArticle.comment_num}}</span></p>
        </div>
        <template v-if="myArticle.user_id!=userId">
            <div class="your_action_right" @click="follow()">
                <img v-if="myArticle.is_follow==0" src="../assets/images/follow.png" alt="">
                <img v-else src="../assets/images/follow3.png" alt="">
            </div>
        </template>
    </div>
</template>

<script>
    import {mapState, mapMutations, mapActions} from 'vuex';

    export default {
        props: {
            article: {},
            is_comment: {
                default: false
            }
        },
        computed: {
            ...mapState(['userId']),
            myArticle() {
                return this.article;
            }
        },
        methods: {
            detail: function () {
                this.$router.push({name: 'Detail', params: {id: this.article.id}});
            },
            support: function () {
                if (this.myArticle.is_support == 0) {
                    this.myArticle.is_support = 1;
                    this.myArticle.support_num += 1;
                    axios.post('/flwechat/public/action',
                            {article_id: this.myArticle.id, user_id: this.userId, type: 0})
                            .then(
                                    function (response) {
                                        console.log(response.data);
                                    }, function (response) {
                                        console.log(response.data);
                                    });
                } else {
                    this.myArticle.is_support = 0;
                    this.myArticle.support_num -= 1;
                    axios.post('/flwechat/public/action/cancel',
                            {article_id: this.myArticle.id, user_id: this.userId, type: 0})
                            .then(
                                    function (response) {
                                        console.log(response.data);
                                    }, function (response) {
                                        console.log(response.data);
                                    });
                }
            },
            oppose: function () {
                if (this.myArticle.is_oppose == 0) {
                    this.myArticle.is_oppose = 1;
                    this.myArticle.oppose_num += 1;
                    axios.post('/flwechat/public/action',
                            {article_id: this.myArticle.id, user_id: this.userId, type: 1})
                            .then(
                                    function (response) {
                                        console.log(response.data);
                                    }, function (response) {
                                        console.log(response.data);
                                    });
                } else {
                    this.myArticle.is_oppose = 0;
                    this.myArticle.oppose_num -= 1;
                    axios.post('/flwechat/public/action/cancel',
                            {article_id: this.myArticle.id, user_id: this.userId, type: 1})
                            .then(
                                    function (response) {
                                        console.log(response.data);
                                    }, function (response) {
                                        console.log(response.data);
                                    });
                }
            },
            follow: function () {
                if (this.myArticle.is_follow == 0) {
                    this.myArticle.is_follow = 1;
                    axios.post('/flwechat/public/follow',
                            {follow_user_id: this.userId, be_follow_id: this.myArticle.id, type: 1})
                            .then(
                                    function (response) {
                                        console.log(response.data);
                                    }, function (response) {
                                        console.log(response.data);
                                    });
                } else {
                    this.myArticle.is_follow = 0;
                    axios.post('/flwechat/public/follow/cancel_follow',
                            {follow_user_id: this.userId, be_follow_id: this.myArticle.id, type: 1})
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
    .your_action {
        width: 100%;
        height: 44px;
        padding: 0 15px;
    }

    .your_action .your_action_right {
        padding: 0 8px;
        line-height: 44px;
        display: inline-block;
        text-align: center;
    }

    .your_action img {
        vertical-align: middle;
        width: 16px;
        height: 16px;
        margin-right: 2px;
    }

    .your_action span, .your_action p {
        font-size: 12px;
        color: #8a8a8a;
    }

    .your_action span {
        padding-left: 3px;
        color: inherit;
    }
</style>
