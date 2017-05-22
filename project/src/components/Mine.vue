<template>
    <div>
        <div v-cloak class="my_messages">
            <img :src="showUser.head_img" alt="" class="head_portrait_top"/>
            <div class="my_messages_middle">
                <div class="name">{{showUser.nickname}}</div>
                <div class="my_messages_num">
                    <div>
                        <p id="follow_num" class="follow_num">{{showUser.follow_users.length}}</p>
                        <p>关注</p>
                    </div>
                    <div>
                        <p id="be_follow_num" class="follow_num">{{showUser.fans.length}}</p>
                        <p>粉丝</p>
                    </div>
                </div>
            </div>
            <div class="my_messages_right">
                <i v-if="showId==user.id" class="icon-notice follow_action weui-tabbar__icon"></i>
                <i v-else class="icon-follow follow_action weui-tabbar__icon" :class="{yes:is_follow}" @click="follow"></i>
                <div class="my_messages_friend">
                    <i v-if="showId==user.id" class="icon-add-friend weui-tabbar__icon" :class="{yes:is_follow}" @click="goMessage()"></i>
                    <i v-else class="icon-add-friend weui-tabbar__icon" :class="{yes:is_friend}" @click="friend"></i>
                </div>
            </div>
        </div>
        <div class="messages">
            <ul>
                <li :class="{selected:select[1]}" @click="LoadArticles(1)">发布</li>
                <li v-if="showId==user.id" :class="{selected:select[0]}" @click="LoadArticles(0)">收藏</li>
                <li :class="{selected:select[2]}" @click="LoadArticles(2)">关注</li>
            </ul>
        </div>
        <div class="blank" v-if="articles.length==0"><img src="../assets/images/none.png" alt=""></div>
        <div class="my_article_box">
            <articles :article="item" v-for="item in articles" :key="item.id"></articles>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapState, mapActions} from 'vuex';
    import articles from '@/components/Article';

    export default{
        data() {
            return {
                show: true,
                showId: 0,
                is_follow: false,
                is_friend: false,
                items: [],
                select: [false, true, false],
                types: ["private", 'public', 'follow'],
                showUser: {follow_users: {}, fans: {}}
            }
        },
        computed: mapState(['user', 'articles']),
        methods: {
            ...mapActions(["getArticles", "getUser"]),
            Init() {
                if (this.showId != this.user.id) {
                    axios.get('/api/users/' + this.showId)
                            .then(response=> {
                                this.showUser = response.data;
                                for (var i in this.showUser.fans) {
                                    if (this.showUser.fans[i].id == this.user.id) {
                                        this.is_follow = true;
                                        break;
                                    }
                                }
                                for (var i in this.showUser.receive_friends) {
                                    if (this.showUser.receive_friends[i].id == this.user.id) {
                                        this.is_friend = true;
                                        break;
                                    }
                                }
                            })
                } else {
                    this.showUser = this.user;
                }
            },
            LoadArticles(index) {
                for (var i = 0; i < this.select.length; i++) {
                    this.select[i] = false;
                }
                this.select[index] = true;
                var data = {type: this.types[index], user_id: this.showId};
                this.getArticles(data);
            },
            follow(){
                if (this.is_follow) {
                    this.is_follow = false;
                    axios.put('/api/users/' + this.user.id, {type: 'cancel_follow', user_id: this.showId})
                            .then(response=> {
                                console.log(response.data);
                            })
                } else {
                    this.is_follow = true;
                    axios.put('/api/users/' + this.user.id, {type: 'follow', user_id: this.showId})
                            .then(response=> {
                                console.log(response.data);
                            })
                }
            },
            friend(){
                if (this.is_friend) {
                    this.is_friend = false;
                    axios.put('/api/users/' + this.user.id, {type: 'delete_friend', user_id: this.showId})
                            .then(response=> {
                                console.log(response.data);
                            })
                } else {
                    this.is_friend = true;
                    axios.put('/api/users/' + this.user.id, {type: 'make_friend', user_id: this.showId})
                            .then(response=> {
                                console.log(response.data);
                            })
                }
            }
        },
        mounted() {
            this.showId = this.$route.params.id;
            if (this.showId == null) {
                this.showId = this.user.id;
            }
            this.Init();
            this.LoadArticles(1);
        },
        components: {
            articles
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .my_messages {
        height: 88px;
        padding: 8px;
        border-bottom: 1px solid #bababa;
    }

    .my_messages_middle {
        float: left;
    }

    .head_portrait_top {
        width: 80px;
        height: 80px;
        border-radius: 5px;
        vertical-align: middle;
        margin-right: 12px;
        float: left;
    }

    .my_messages_middle {
        float: left;
    }

    .my_messages_middle, .my_messages_num, .my_messages_num div, .my_messages_right {
        display: inline-block;
    }

    .follow_num {
        text-align: center;
    }

    .my_messages_right {
        height: 80px;
        float: right;
        i{
            margin: 8px 15px;
            float: none;
            display: block;
        }
        .yes {
            color: #0084FF
        }

    }

    .my_messages_friend {
        position: relative;
    }

    .messages {
        background-color: #fff;
        text-align: center;
        border-bottom: 6px solid #f5f5f5;
    }

    .messages ul li {
        display: inline-block;
        width: 28%;
        color: #8a8a8a;
    }

    .messages ul li a {
        width: 100%;
    }

    .messages .selected {
        color: #0084FF;
    }

    .blank {
        padding-top: 30%;
        text-align: center;
    }

    .my_article_box {
        padding-bottom: 53px;
    }
</style>
