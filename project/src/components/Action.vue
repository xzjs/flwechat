<template>
    <div class="your_action">
        <div v-if="!is_comment && myArticle.article_id!=null" class="your_action_right">
            <a :href="'article_detail.html?reply_id=' + myArticle.reply_id">
                <img src="../assets/images/back_to_original.png" alt="">
                <span>原文</span>
            </a>
        </div>
        <div class="your_action_right" @click="support">
            <p :class="{text:agree}">赞<span>{{agreeNum}}</span></p>
        </div>
        <div class="your_action_right" @click="tread()">
            <p :class="{text:oppose}">踩<span>{{opposeNum}}</span></p>
        </div>
        <div class="your_action_right" @click="detail()">
            <p>评论<span>{{myArticle.comments.length}}</span></p>
        </div>
        <template v-if="myArticle.user_id!=user.id">
            <div class="your_action_right" @click="follow()">
                <p v-if="myArticle.is_follow==0">关注</p>
                <p v-else style="color:#0084FF">关注</p>
            </div>
        </template>
    </div>
</template>

<script>
    import {mapState, mapMutations, mapActions} from 'vuex';

    export default {
        data(){
            return {
                myArticle: this.article,

                agree: false,
                agreeId: 0,
                agreeNum: 0,

                oppose: false,
                opposeNum: 0,
                opposeId:0
            }
        },
        props: {
            article: {},
            is_comment: {
                default: false
            }
        },
        computed: {
            ...mapState(['user']),
        },
        methods: {
            detail: function () {
                this.$router.push({name: 'Detail', params: {id: this.article.id}});
            },
            support: function () {
                if (this.agree) {
                    this.agree = false;
                    this.agreeNum--;
                    axios.delete('/api/agrees/' + this.agreeId)
                            .then(response=> {
                                console.log(response.data);
                            })
                            .catch(response=> {
                                console.log(response.data);
                            });

                } else {
                    this.agree = true;
                    this.agreeNum++;
                    axios.post('/api/agrees', {article_id: this.myArticle.id})
                            .then(response=> {
                                this.agreeId = response.data;
                            })
                            .catch(response=> {
                                console.log(response.data);
                            });
                }
            },
            tread() {
                if (this.oppose) {
                    this.oppose = false;
                    this.opposeNum--;
                    axios.delete('/api/opposes/' + this.opposeId)
                            .then(response=> {
                                console.log(response.data);
                            })
                            .catch(response=> {
                                console.log(response.data);
                            });

                } else {
                    this.oppose = true;
                    this.opposeNum++;
                    axios.post('/api/opposes', {article_id: this.myArticle.id})
                            .then(response=> {
                                this.agreeId = response.data;
                            })
                            .catch(response=> {
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
                                    response=> {
                                        console.log(response.data);
                                    }, response=> {
                                        console.log(response.data);
                                    });
                } else {
                    this.myArticle.is_follow = 0;
                    axios.post('/flwechat/public/follow/cancel_follow',
                            {follow_user_id: this.userId, be_follow_id: this.myArticle.id, type: 1})
                            .then(
                                    response=> {
                                        console.log(response.data);
                                    }, response=> {
                                        console.log(response.data);
                                    });
                }
            }
        },
        created(){
            for (var item in this.myArticle.agrees) {
                if (this.myArticle.agrees[item].user_id == this.user.id) {
                    this.agree = true;
                    this.agreeId = this.myArticle.agrees[item].id;
                    break;
                }
            }
            this.agreeNum = this.myArticle.agrees.length;
            for (var item in this.myArticle.opposes) {
                if (this.myArticle.opposes[item].user_id == this.user.id) {
                    this.oppose = true;
                    this.opposeId = this.myArticle.opposes[item].id;
                    break;
                }
            }
            this.opposeNum = this.myArticle.opposes.length;
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
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

        .text{
            color: #0084FF
        }
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
