<template>
    <div class="swiper-container pic_show">
        <div  class="swiper-wrapper pic_show_list">
            <div v-for="img in images" class="swiper-slide userImg" @click="show_img(img.id)" >
                <img :src="'http://images.frilink.cn/' + img.img+'-image'" alt="" class="img_show">
                <img :src="process.env.API_ROOT+'/storage/' + img.mark" alt="" class="article_list_mark_img">
            </div>
        </div>
    </div>
</template>

<script>
    import Swiper from 'swiper';
    import 'swiper/dist/css/swiper.min.css';
    import 'swiper/dist/js/swiper.min.js';
    import { mapState } from 'vuex';

    export default {
        props: ['images'],
        methods: {
            show_img: function (image_id) {
//                $.cookie('back', window.location.href);
//                window.location.href = 'show.html?image_id=' + image_id;
                console.log(image_id);
                this.$router.push({name:'Show',params:{id:image_id}});
            }
        },
        mounted: function () {
            var mySwiper = new Swiper('.swiper-container', {
                effect: 'coverflow',
                slidesPerView: 3,
                centeredSlides: true,
            });
        },
        updated: function () {
            var mySwiper = new Swiper('.swiper-container', {
                effect: 'coverflow',
                slidesPerView: 3,
                centeredSlides: true,
            });
        },
        computed:mapState(['url'])
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /*图片大小调整*/
    /*ipad mini 768*1024*/
    @media screen and (min-width: 768px)and (max-width: 1024px){
        .pic_show{
            width:808px;
            /*margin:0 auto;*/
            padding-top:5px;
            left:-20px;
        }
        .pic_show_list{
            width: 808px;
            text-align: center;
        }
        .userImg{
            position: relative;
            overflow: hidden;
            display: inline-block;
            /*float: left;*/
        }
        .pic_show img{
            width:269px;
        }
        .article_list_mark_img{
            position: absolute;
            top:0;
            left: 0;
        }
    }
    /*iphone6plus 414*736*/
    @media screen and (min-width: 414px)and (max-width: 767px){
        .pic_show{
            width:454px;
            /*margin:0 auto;*/
            padding-top:5px;
            left:-20px;
        }
        .pic_show_list{
            width: 454px;
            text-align: center;
        }
        .userImg{
            position: relative;
            overflow: hidden;
            display: inline-block;
        }
        .pic_show img{
            width:151px;
        }
        .article_list_mark_img{
            position: absolute;
            top:0;
            left: 0;
        }
    }
    /*iphone6 375*667*/
    @media screen and (min-width: 375px)and (max-width: 413px){
        .pic_show{
            width:415px;
            /*margin:0 auto;*/
            padding-top:5px;
            left:-20px;
        }
        .pic_show_list{
            width: 415px;
            text-align: center;
        }
        .userImg{
            position: relative;
            overflow: hidden;
            display: inline-block;
        }
        .pic_show img{
            width:138px;
        }
        .article_list_mark_img{
            position: absolute;
            top:0;
            left: 0;
        }
    }
    /*galaxy系列360*640*/
    @media screen and (min-width: 360px)and (max-width: 374px){
        .pic_show{
            width:400px;
            /*margin:0 auto;*/
            padding-top:5px;
            left:-20px;
        }
        .pic_show_list{
            width: 390px;
            text-align: center;
        }
        .userImg{
            position: relative;
            overflow: hidden;
            display: inline-block;
        }
        .pic_show img{
            width:133px;
        }
        .article_list_mark_img{
            position: absolute;
            top:0;
            left: 0;
        }
    }
    @media screen and (max-width: 320px){
        .pic_show{
            width:360px;
            /*margin:0 auto;*/
            padding-top:5px;
            left:-20px;
        }
        .pic_show_list{
            width: 360px;
            text-align: center;
        }
        .userImg{
            position: relative;
            overflow: hidden;
            display: inline-block;
        }
        .pic_show img{
            width:120px;
        }
        .article_list_mark_img{
            position: absolute;
            top:0;
            left: 0;
        }
    }
</style>
