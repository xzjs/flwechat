<template>
    <div class="container">
        <div>
            <transition>
                <router-view></router-view>
            </transition>
            <div class="weui-tabbar">
                <router-link :to="{name:'Index',params:{topic_id:0}}" class="weui-tabbar__item">
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
                <router-link :to="{name:'Publish'}" class="weui-tabbar__item">
                    <img :src="img3" alt="" class="weui-tabbar__icon">
                    <p class="weui-tabbar__label">发布</p>
                </router-link>
                <router-link :to="{name:'Friend'}" class="weui-tabbar__item">
                    <span style="display: inline-block;position: relative;">
                        <img :src="img4" alt="" class="weui-tabbar__icon friend_icon">
                        <!--<span class="weui-badge weui-badge_dot" style="position: absolute;top: 0;right: -6px;"></span>-->
                    </span>
                    <p class="weui-tabbar__label">好友</p>
                </router-link>
                <router-link :to="{name:'Mine'}" class="weui-tabbar__item">
                    <img :src="img5" alt="" class="weui-tabbar__icon mine_icon">
                    <p class="weui-tabbar__label">我</p>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import home1 from '@/assets/images/homepage.png';
    import home2 from '@/assets/images/homepage2.png';
    import follow1 from '@/assets/images/follow.png';
    import follow2 from '@/assets/images/follow2.png';
    import release1 from '@/assets/images/release.png';
    import release2 from '@/assets/images/release2.png';
    import friend1 from '@/assets/images/friend.png';
    import friend2 from '@/assets/images/friend2.png';
    import me1 from '@/assets/images/me.png';
    import me2 from '@/assets/images/me2.png';

    export default{
        name: 'nav',
        data(){
            return {
                img1: home2,
                img2: follow1,
                img3: release1,
                img4: friend1,
                img5: me1
            }
        },
        watch: {
            '$route' (to, from){
                this.img1 = home1;
                this.img4 = friend1;
                this.img5 = me1;
                switch (to.name) {
                    case "Index":
                        this.img1 = home2;
                        break;
                    case "Friend":
                        this.img4 = friend2;
                        break;
                    case "Mine":
                        this.img5 = me2;
                        break;
                    case "Publish":
                        this.img3=release2;
                        break;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .weui-tabbar {
        position: fixed;
        bottom: 0;
    }

    .router-link-active {

        p {
            color: #0084FF;
        }

    }
</style>