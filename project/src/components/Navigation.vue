<template>
    <div class="container">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
        <div class="weui-tabbar">
            <router-link :to="{name:'Index',params:{topic_id:0}}" class="weui-tabbar__item">
                <i class="icon-home weui-tabbar__icon"></i>
                <p class="weui-tabbar__label">首页</p>
            </router-link>
            <router-link :to="{name:'Notice'}" class="weui-tabbar__item">
                <el-badge :value="count" class="item">
                    <i class="icon-notice weui-tabbar__icon"></i>
                    <p class="weui-tabbar__label">消息</p>
                </el-badge>
            </router-link>
            <router-link :to="{name:'Publish'}" class="weui-tabbar__item">
                <i class="icon-publish weui-tabbar__icon"></i>
                <p class="weui-tabbar__label">发布</p>
            </router-link>
            <router-link :to="{name:'Friend'}" class="weui-tabbar__item">
                <i class="icon-friend weui-tabbar__icon"></i>
                <p class="weui-tabbar__label">好友</p>
            </router-link>
            <router-link :to="{name:'Mine'}" class="weui-tabbar__item">
                <i class="icon-mine weui-tabbar__icon"></i>
                <p class="weui-tabbar__label">我</p>
            </router-link>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';

    export default{
        computed: {
            count(){
                return this.$store.state.notices.length;
            }
        },
        mounted: function () {
            this.getNotices();
            this.getTopics();
        },
        created(){
            this.getUser({id:0});
        },
        methods: {
            ...mapActions(['getNotices', 'getTopics','getUser']),
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../assets/css/icon_style.css";

    .weui-tabbar {
        position: fixed;
        bottom: 0;
    }

    .router-link-active {
        p, i {
            color: #0084FF;
        }
    }
</style>
