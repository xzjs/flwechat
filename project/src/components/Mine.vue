<template>
    <div class="container">
        <div v-cloak class="my_messages">
            <img :src="user.head_img" alt="" class="head_portrait_top"/>
            <div class="my_messages_middle">
                <div class="name">{{user.nickname}}</div>
                <div class="my_messages_num">
                    <div>
                        <p id="follow_num" class="follow_num">{{user.follow}}</p>
                        <p>关注</p>
                    </div>
                    <div>
                        <p id="be_follow_num" class="follow_num">{{user.be_follow}}</p>
                        <p>粉丝</p>
                    </div>
                </div>
            </div>
            <div class="my_messages_right">
                <img v-if="showId==userId" class="follow_action" src="../assets/images/message.png" alt="">
                <img v-else-if="is_follow==true" class="follow_action" src="../assets/images/follow3.png" alt=""
                     @click="cancelFollow()">
                <img v-else class="follow_action" src="../assets/images/follow.png" alt="" @click="follow()">

                <div class="my_messages_friend">
                    <img v-if="showId==user_id" src="../assets/images/add_friend.png" alt="" @click="goMessage()">
                    <img v-else-if="is_friend==true" src="../assets/images/add_friend2.png" alt="">
                    <img v-else src="../assets/images/add_friend.png" alt="" @click="makeFriend()">
                    <span class="weui-badge weui-badge_dot"
                          style="position: absolute;top: 5px;right: 15px;display: none"></span>
                </div>
            </div>
        </div>
        <div class="messages">
            <ul>
                <li :class="{selected:select[1]}" @click="getArticles(1)">发布</li>
                <li v-if="showId==userId" :class="{selected:select[0]}" @click="getArticles(0)">收藏</li>
                <li :class="{selected:select[2]}" @click="getArticles(2)">关注</li>
            </ul>
        </div>
        <div class="blank" v-if="show"><img src="@/assets/images/none.png" alt=""></div>
        <div class="my_article_box">
            <articles :article_list="items"></articles>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import {mapState} from 'vuex';
    import articles from '@/components/Article';

    export default{
        data: function () {
            return {
                show:true,
                user: {},
                showId: 0,
                is_follow: false,
                is_friend: false,
                items:[],
                select: [false, true, false],
            }
        },
        computed: mapState([
            'userId'
        ]),
        methods: {
            getUser: function () {
                var vm = this;
                axios.get('/flwechat/public/user/' + this.showId)
                        .then(function (response) {
                            vm.user = response.data;
                        })
                        .catch(function (response) {
                            console.log(response);
                        });
                if (vm.showId != vm.userId) {
                    //检测是否关注
                    axios.post('/flwechat/public/follow/get_follow_list',
                            {id: vm.userId, type: 0})
                            .then(function (response) {
                                var follows = response.data;
                                for (var i = 0; i < follows.length; i++) {
                                    if (follows[i].id == vm.showId) {
                                        vm.is_follow = true;
                                        break;
                                    }
                                }
                            })
                            .catch(function (response) {
                                console.log(response);
                            });
                    //检测是否为好友
                    axios.post('/flwechat/public/friend/get_friends',
                            {id: vm.userId, type: 0})
                            .then(function (response) {
                                var friends = response.data;
                                for (var i = 0; i < friends.length; i++) {
                                    if (friends[i].id == vm.showId) {
                                        vm.is_friend = true;
                                        break;
                                    }
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                }
            },
            getArticles: function (index) {
                var vm = this;
                for (var i = 0; i < vm.select.length; i++) {
                    vm.select[i] = false;
                }
                vm.select[index] = true;
                switch (index) {
                    case 0:
                        vm.postData = {page: 0, size: 15, user_id: vm.showId, is_public: 0, type: 4};
                        break;
                    case 1:
                        vm.postData = {page: 0, size: 15, user_id: vm.showId, is_public: 1, type: 4};
                        break;
                    case 2:
                        vm.postData = {page: 0, size: 15, user_id: vm.showId, follow_article: 1};
                        break;
                }
                axios.post('/flwechat/public/article/article_list', vm.postData)
                        .then(
                                function (response) {
                                    vm.items = response.data;
                                    if (response.data.length > 0) {
                                        vm.show = false;
                                    } else {
                                        vm.show = true;
                                    }
                                }, function (response) {
                                    console.log(response.data);
                                });
            },
        },
        mounted: function () {
            this.showId = this.$route.params.id;
            if(this.showId==null){
                this.showId=this.userId;
            }
            this.getUser();
            this.getArticles(1);
        },
        components:{
            articles
        }
    }
</script>

<style scoped>
    .container{
        background-color: #f5f5f5;
    }
    .my_messages{
        height:88px;
        padding:8px;
        border-bottom:1px solid #bababa;
    }
    .my_messages_middle{
        float: left;
    }
    .head_portrait_top{
        width:80px;
        height:80px;
        border-radius: 5px;
        vertical-align: middle;
        margin-right: 12px;
        float: left;
    }
    .my_messages_middle{
        float: left;
    }
    .my_messages_middle,.my_messages_num,.my_messages_num div,.my_messages_right{
        display: inline-block;
    }
    .follow_num{
        text-align: center;
    }
    .my_messages_right{
        height:80px;
        float: right;
    }
    .my_messages_right img{
        margin: 8px 15px;
        float: none;
        display: block;
    }
    .my_messages_friend{
        position: relative;
    }
    .messages{
        background-color: #fff;
        text-align: center;
        border-bottom: 6px solid #f5f5f5;
    }
    .messages ul li{
        display: inline-block;
        width: 28%;
        color: #8a8a8a;
    }
    .messages ul li a{
        width:100%;
    }
    .messages .selected{
        color:#0084FF;
    }
    .blank{
        padding-top:30%;
        text-align: center;
    }
</style>
