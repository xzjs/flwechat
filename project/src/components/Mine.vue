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
                <img v-if="show_user_id==user_id" class="follow_action" src="../../static/images/message.png" alt="">
                <img v-else-if="is_follow==true" class="follow_action" src="images/follow3.png" alt=""
                     @click="cancelFollow()">
                <img v-else class="follow_action" src="images/follow.png" alt="" @click="follow()">

                <div class="my_messages_friend">
                    <img v-if="show_user_id==user_id" src="../../static/images/add_friend.png" alt="" @click="goMessage()">
                    <img v-else-if="is_friend==true" src="images/add_friend2.png" alt="">
                    <img v-else src="images/add_friend.png" alt="" @click="makeFriend()">
                    <span class="weui-badge weui-badge_dot"
                          style="position: absolute;top: 5px;right: 15px;display: none"></span>
                </div>
            </div>
        </div>
        <div class="messages">
            <ul>
                <li :class="{selected:select[1]}" @click="getArticles(1)">发布</li>
                <li v-if="showId==0" :class="{selected:select[0]}" @click="getArticles(0)">收藏</li>
                <li :class="{selected:select[2]}" @click="getArticles(2)">关注</li>
            </ul>
        </div>
        <div class="blank" v-if="show"><img src="images/none.png" alt=""></div>
        <div class="my_article_box">
            <!--<article-list :article_list="items"></article-list>-->
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import {mapState} from 'vuex';

    export default{
        data: function () {
            return {
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
                axios.get('/flwechat/public/user/' + this.userId)
                        .then(function (response) {
                            vm.user = response.data;
                            vm.showId = vm.$route.id;
                            if(vm.showId==null){
                                vm.showId=0;
                            }
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
                                console.log(follows);
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
                                console.log(friends);
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
        },
        mounted: function () {
            this.getUser();
        }
    }
</script>

<style scoped>
    .container{
        background-color: #f5f5f5;
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
    .selected{
        color:#0084FF;
    }
    .blank{
        padding-top:30%;
        text-align: center;
    }
</style>