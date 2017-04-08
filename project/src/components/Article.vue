<template>
    <div class=" swiper-container pic_show">
        <div  class="swiper-wrapper pic_show_list">
            <div v-for="img in images" class="swiper-slide userImg" @click="show_img(img.id)" >
                <img :src="'http://images.frilink.cn/' + img.img+'_image'" alt="" class="img_show">
                <img :src="['/flwechat/public/storage/' + img.mark]" alt="" class="article_list_mark_img">
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        name: 'hello',
        data () {
            return {
                msg: 'Welcome xzjs'
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    *:focus{
        outline:none;
    }
    a{
        color: #000;
    }
    .topic_index_box nav{
        margin-right: 35px;
    }
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

    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
        color: #b2b2b2;
    }
    input:-moz-placeholder, textarea:-moz-placeholder {
        color:#b2b2b2;
    }
    input::-moz-placeholder, textarea::-moz-placeholder {
        color:#b2b2b2;
    }
    input:-ms-input-placeholder, textarea:-ms-input-placeholder {
        color:#b2b2b2;
    }
</style>
