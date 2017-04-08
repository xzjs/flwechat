<template>
    <div class="your_action" id="action">
        <div v-if="article.reply_id>0" class="your_action_right">
            <a  :href="'article_detail.html?reply_id=' + article.reply_id">
                <img src="images/back_to_original.png" alt="">
                <span>原文</span>
            </a>
        </div>
        <div class="your_action_right" @click="support">
            <p v-if="article.is_support==0">赞<span>{{article.support_num}}</span></p>
            <p v-else style="color:#0084FF">赞<span>{{article.support_num}}</span></p>
        </div>
        <div class="your_action_right" @click="oppose()">
            <p v-if="article.is_oppose==0">踩<span>{{article.oppose_num}}</span></p>
            <p v-else style="color:#0084FF">踩<span>{{article.oppose_num}}</span></p>
        </div>
        <div class="your_action_right" @click="detail()">
            <p>评论<span>{{article.comment_num}}</span></p>
        </div>
        <template v-if="article.user_id!=userId">
            <div class="your_action_right" @click="follow()">
                <img v-if="article.is_follow==0" src="images/follow.png" alt="">
                <img v-else src="images/follow3.png" alt="">
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        props: ['article'],
        data: function () {
            return {
                userId: 0
            }
        },
        created: function () {
            this.userId = user_id;
        },
        methods: {
            detail: function () {
                window.location.href = 'article_detail.html?reply_id=' + this.article.id;
            },
            support: function () {
                if (this.article.is_support == 0) {
                    this.article.is_support = 1;
                    this.article.support_num += 1;
                    axios.post('/flwechat/public/action',
                            {article_id: this.article.id, user_id: this.userId, type: 0})
                            .then(
                                    function (response) {
                                        console.log(response.data);
                                    }, function (response) {
                                        console.log(response.data);
                                    });
                } else {
                    this.article.is_support = 0;
                    this.article.support_num -= 1;
                    axios.post('/flwechat/public/action/cancel',
                            {article_id: this.article.id, user_id: this.userId, type: 0})
                            .then(
                                    function (response) {
                                        console.log(response.data);
                                    }, function (response) {
                                        console.log(response.data);
                                    });
                }
            },
            oppose: function () {
                if (this.article.is_oppose == 0) {
                    this.article.is_oppose = 1;
                    this.article.oppose_num += 1;
                    axios.post('/flwechat/public/action',
                            {article_id: this.article.id, user_id: this.userId, type: 1})
                            .then(
                                    function (response) {
                                        console.log(response.data);
                                    }, function (response) {
                                        console.log(response.data);
                                    });
                } else {
                    this.article.is_oppose = 0;
                    this.article.oppose_num -= 1;
                    axios.post('/flwechat/public/action/cancel',
                            {article_id: this.article.id, user_id: this.userId, type: 1})
                            .then(
                                    function (response) {
                                        console.log(response.data);
                                    }, function (response) {
                                        console.log(response.data);
                                    });
                }
            },
            follow: function () {
                if (this.article.is_follow == 0) {
                    this.article.is_follow = 1;
                    axios.post('/flwechat/public/follow',
                            {follow_user_id: this.userId, be_follow_id: this.article.id, type: 1})
                            .then(
                                    function (response) {
                                        console.log(response.data);
                                    }, function (response) {
                                        console.log(response.data);
                                    });
                } else {
                    this.article.is_follow = 0;
                    axios.post('/flwechat/public/follow/cancel_follow',
                            {follow_user_id: this.userId, be_follow_id: this.article.id, type: 1})
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
