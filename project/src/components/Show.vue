<template>
  <div class="show_box" style="text-align: center">
    <mt-swipe :auto="0">
      <mt-swipe-item>
        <div class="front" id="galleryImg">
          <img src="../assets/images/img1.jpeg" alt="" class="img_original">
          <img src="../assets/images/img1-1.png" alt="" class="img_mark">
          <div v-if="show" class="UserCommentButton">
            <div class="UserComment">
              <div class="user_mark"></div>
              <div class="user_comment">
                <img src="../assets/images/me2.png" alt="" class="head_img">
                <span>昵称</span><span>&bull;</span><span>主题</span>
                <p id="img_article_content" class="comment_txt">当今社会，计算机与网络信息技术飞速发展，创新的信息传播与实时交互模式不断涌现，</p>
              </div>
            </div>
            <div class="button_box">
              <div class="button_mark"></div>
              <div class="button">
                <!--<action :article="images[index].article"></action>-->
                <div class="bullet_screen_img">
                  <span class="close"><img src="../assets/images/close2.png" alt=""></span><span class="url" @click="toBack()"><img src="../assets/images/url2.png" alt=""></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="back">
          <div class="back_box" style="opacity: 0">
            <div class="back-content">
              <p class="expands">相关阅读</p>
              <!--另外一种颜色的class是expands_li_background_color-->
              <!--<ul>-->
                <!--<li v-for="(item,index) in images[index].expands"-->
                    <!--:class="{bgc:classActive[index]}">-->
                  <!--<a :href="item.href">-->
                    <!--<p class="expands_title">{{item.title}}</p>-->
                    <!--<p class="expands_abstract">-->
                      <!--{{item.abstract}}-->
                    <!--</p>-->
                  <!--</a>-->
                <!--</li>-->
                <!--&lt;!&ndash;<li class="expands_li_background_color">信息流广告</li>&ndash;&gt;-->
              <!--</ul>-->
            </div>
            <div class="button_box">
              <!--<div class="button_mark"></div>-->
              <!--<div class="button">-->
                <span class="close"><img src="../assets/images/close2.png" alt=""></span><span class="url" @click="toFront()"><img src="../assets/images/back_to_original2.png" alt=""></span>
              <!--</div>-->
            </div>
          </div>
        </div>
      </mt-swipe-item>
      <!--<mt-swipe-item>2</mt-swipe-item>-->
      <!--<mt-swipe-item>3</mt-swipe-item>-->
    </mt-swipe>
    <img :src="'http://image.frinlin.cn/'+image.img+'-image'" v-for="image in images">
  </div>
</template>
<script>
  import action from '@/components/Action';
  import { mapState } from 'vuex';
  export default{
    data(){
      return {
        imageId: 0,
        images: [],
        index: 0,
        show:true,
        flag: 1,
//        isTurn:turn,
//        classActive:[],
      }
    },
    computed:mapState([
        'userId'
    ]),
    methods: {
      getImages(){
        var vm = this;
        axios.get('/flwechat/public/images', {
            params:{
                img_id: this.imageId,
                user_id: this.userId
            }
        })
          .then(function (response) {
            console.log(response.data);
            vm.images = response.data;
            for (var i = 0; i < vm.images.length; i++) {
              if (vm.images[i].id == vm.imageId) {
                vm.index = i;
                break;
              }
            }
          })
          .catch(function (error) {
            console.log(error);
          })
      },
//      close: function () {
//        window.location.href = $.cookie('back');
//      },

      toBack: function () {
        var back = $(".back"), front = $(".front");
//        var front_button=$('.front .button_box');
//        if (this.flag == 1) {
          back.css('display', 'block');
          front.removeClass('test2');
          back.children().removeClass("test");
          front.addClass("test");
          back.children().addClass('test2');
          setTimeout(function () {
            $('.front').css('display', 'none');
          }, 375);
      },

//      imgClick:function () {
//
//        this.show=(!this.show);
//        console.log('hello');
//      }
      toFront: function (){
        var back = $(".back"), front = $(".front");
        front.css('display', 'block');
        front.removeClass("test");
        back.children().removeClass('test2');
        front.addClass("test2");
        back.children().addClass('test');
        setTimeout(function () {
          back.css('display', 'none');
        }, 750);

        //修改地址栏历史
        var href = window.location.href.split('&')[0];
        history.pushState({}, "图片展示", href);
        this.flag = 1;
      },
    },
    mounted: function () {
       $('.show_box').height($(window).height()) ;
       $('.UserComment').height($('.comment_txt').height()+35);
      this.imageId = this.$route.params.id;
      this.getImages();
    }
  }
</script>
<style lang="scss" scoped>
  @-webkit-keyframes flipOutYtest {
    from {
      -webkit-transform: perspective(1400px);
      transform: perspective(1400px);
    }

    40% {
      -webkit-transform: perspective(1400px) rotate3d(0, 1, 0, 60deg);
      transform: perspective(1400px) rotate3d(0, 1, 0, 60deg);
      opacity: 1;
    }

    50% {
      -webkit-transform: perspective(1400px) rotate3d(0, 1, 0, 90deg);
      transform: perspective(1400px) rotate3d(0, 1, 0, 90deg);
      opacity: 0;
    }

    to {
      -webkit-transform: perspective(1400px) rotate3d(0, 1, 0, 180deg);
      transform: perspective(1400px) rotate3d(0, 1, 0, 180deg);
      opacity: 0;
    }
  }

  .test{
    -webkit-animation: flipOutYtest 0.75s linear;
    animation: flipOutYtest 0.75s linear;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    height:100%;
  }


  @-webkit-keyframes flipInYtest {
    from {
      -webkit-transform: perspective(1400px) rotate3d(0, 1, 0, -180deg);
      transform: perspective(1400px) rotate3d(0, 1, 0, -180deg);
      opacity: 0;
    }

    50% {
      -webkit-transform: perspective(1400px) rotate3d(0, 1, 0, -90deg);
      transform: perspective(1400px) rotate3d(0, 1, 0, -90deg);
      opacity: 0;
    }

    60% {
      -webkit-transform: perspective(1400px) rotate3d(0, 1, 0, -60deg);
      transform: perspective(1400px) rotate3d(0, 1, 0, -60deg);
      opacity: 1;
    }

    to {
      -webkit-transform: perspective(1400px);
      transform: perspective(1400px);
      opacity: 1;
    }
  }

  .test2{
    -webkit-animation: flipInYtest 0.75s linear;
    animation: flipInYtest 0.75s linear;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
  @media screen and (max-height: 568px){
    .back-content ul{
      height:428px;
      overflow-y: scroll;
    }
    .bullet_screen .bullet_screen_content{
      width: 50%;
    }
  }
  @media screen and (min-height: 569px)and (max-height: 640px){
    .back-content ul{
      height:500px;
      overflow-y: scroll;
    }
    .bullet_screen .bullet_screen_content{
      width: 56%;
    }
  }
  @media screen and (min-height: 641px)and (max-height: 667px){
    .back-content ul{
      height:527px;
      overflow-y: scroll;
    }
    .bullet_screen .bullet_screen_content{
      width: 57%;
    }
  }
  @media screen and (min-height: 668px)and (max-height: 736px){
    .back-content ul{
      height:596px;
      overflow-y: scroll;
    }
    .bullet_screen .bullet_screen_content{
      width: 59%;
    }
  }
  /*图片show样式*/
  .show_box{
    position: relative;
    /*background-color: lightgreen;*/
    .front{
      width:100%;
      height:100%;
      z-index:1;
      position:absolute;
      .img_original{
        width:100%;
        position: absolute;
        left:0;
        z-index:2;
      }
      .img_mark{
        width:100%;
        position: absolute;
        left:0;
        z-index: 3;
      }
      .UserCommentButton{
        position: absolute;
        z-index:3;
        font-size: 12px;
        width: 100%;
        height:100%;
        color: #fff;
        .UserComment{
          position: relative;
          top:0;
          height:100px;
          .user_mark{
            width:100%;
            height:100%;
            position: absolute;
            z-index:0;
            background-color: #000;
            opacity: 0.7;
          }
          .user_comment{
            text-align: left;
            position: absolute;
            z-index:1;
            padding:0 15px;
            .head_img{
              vertical-align: middle;
              width: 20px;
              height:20px;
              border-radius: 10px;
              margin:5px 0px;
            }
          }
        }
        .button_box{
          position: absolute;
          height:60px;
          width:100%;
          bottom:0;
          .button_mark{
            width:100%;
            height:100%;
            position: absolute;
            z-index:1;
            background-color: #000;
            opacity: 0.7;
          }
          .button{
            position: absolute;
            padding: 20px 0;
            width:100%;
            z-index:2;
            .bullet_screen_img{
              width:100%;

              .close,.url{
                float: right;
                display: inline-block;
                width:15%;

              }
            }

          }
        }
      }
    }
    .back{
      background-color: #fff;
      height: 100%;
      width:100%;
      .back_box{
        height:100%;
        .back-content{
          margin:0 15px;
          color: #000;
          .expands{
            text-align: center;
            font-size: 22px;
            padding: 10px 0;
            }
          ul li{
            padding:0 10px;
            list-style: none;
            line-height: 30px;
            border-radius: 5px;
            background-color: #bce8f1;
            margin-bottom: 10px;
            max-height: 140px;
            min-height:70px;
            overflow: hidden;
            .bgc{
              background-color: #b7d28d!important;
            }
            a{
              color: #000;
              display: block;
              .expands_title{
                font-weight: 700;
                font-size: 20px;
                height:30px;
                line-height:30px;
                white-space:nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
              }
              .expands_abstract{
                font-size: 14px;
                line-height: 1.4em;
                color: #888888;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                padding-bottom: 5px;
              }
            }
          }
        }
        .button_box{
          width:100%;
          height:60px;
          background-color: #000;
          opacity:0.7;
          position: fixed;
          bottom:0;
          span{
            float: right;
            display: inline-block;
            width:15%;
            margin:20px 0;
          }
        }
      }
    }
  }
</style>
