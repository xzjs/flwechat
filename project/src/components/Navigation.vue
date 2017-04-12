<template>
    <div>
        <transition>
            <router-view></router-view>
        </transition>
        <div class="weui-tabbar">
            <router-link to="/index" class="weui-tabbar__item weui-bar__item_on">
                    <span style="display: inline-block;position: relative;">
                        <img :src="img1" alt="" class="weui-tabbar__icon">
                        <!--<span class="weui-badge" style="position: absolute;top: -2px;right: -13px;">8</span>-->
                    </span>
                <p class="weui-tabbar__label">首页</p>
            </router-link>
            <router-link to="/follow" class="weui-tabbar__item">
                <img :src="img2" alt="" class="weui-tabbar__icon">
                <p class="weui-tabbar__label">关注</p>
            </router-link>
            <router-link to="/publish" class="weui-tabbar__item">
                <img :src="img3" alt="" class="weui-tabbar__icon">
                <p class="weui-tabbar__label">发布</p>
            </router-link>
            <router-link to="/friends" class="weui-tabbar__item">
                    <span style="display: inline-block;position: relative;">
                        <img :src="img4" alt="" class="weui-tabbar__icon friend_icon">
                        <!--<span class="weui-badge weui-badge_dot" style="position: absolute;top: 0;right: -6px;"></span>-->
                    </span>
                <p class="weui-tabbar__label">好友</p>
            </router-link>
            <router-link to="/mine" class="weui-tabbar__item">
                <img :src="img5" alt="" class="weui-tabbar__icon mine_icon">
                <p class="weui-tabbar__label">我</p>
            </router-link>
        </div>
    </div>
</template>

<script>
    import home1 from '../../static/images/homepage.png';
    import home2 from '../../static/images/homepage2.png';
    import follow1 from '../../static/images/follow.png';
    import follow2 from '../../static/images/follow2.png';
    import release1 from '../../static/images/release.png';
    import release12 from '../../static/images/release2.png';
    import friend1 from '../../static/images/friend.png';
    import friend2 from '../../static/images/friend2.png';
    import me1 from '../../static/images/me.png';
    import me2 from '../../static/images/me2.png';

    export default{
        name: 'nav',
        data(){
            return {
                img1: home1,
                img2: follow1,
                img3: release1,
                img4: friend1,
                img5: me1
            }
        },
        watch: {
            '$route' (to, from){
            }
        }
    }
</script>

<style scoped>
    .weui-tabbar {
        position: fixed;
        bottom: 0;
    }
</style>