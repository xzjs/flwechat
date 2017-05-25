<template>
    <div class="show_box" style="text-align: center">
        <mt-swipe :auto="0" :defaultIndex="index" :continuous="false" :showIndicators="false">
            <mt-swipe-item v-for="image in images" :key="image.id">
                <div class="front" id="galleryImg">

                    <img :src="'http://images.frilink.cn/'+image.img+'-big'" alt="" class="img_original">
                    <img :src="url+'/storage/'+ image.mark" alt="" class="img_mark" @click="imgClick()">
                    <div v-if="show" class="UserComment">
                        <!--<div class="user_mask"></div>-->
                        <!--<div class="user_comment">-->
                        <img :src="image.article.user.head_img" alt="" class="head_img">
                        <span>{{image.article.user.nickname}}</span><span>&bull;</span><span>{{image.article.topic.content}}</span>
                        <p id="img_article_content" class="comment_txt">{{image.article.content}}</p>
                        <!--</div>-->
                    </div>
                    <div v-if="show" class="button_box">
                        <action :article="image.article" :is_comment="true" class="show_action"></action>
                        <div class="bullet_screen_img">
                            <span class="close" @click="close()"><img src="../assets/images/close2.png"
                                                                      alt=""></span><span
                                class="url" @click="toBack()"><img src="../assets/images/url2.png" alt=""></span>
                        </div>
                    </div>
                </div>
                <div class="back">
                    <div class="back_box" style="opacity: 0">
                        <div class="back-content">
                            <p class="expands">相关阅读</p>
                            <ul>
                                <li v-for="(item,index) in image.expands"
                                    :class="{expands_li_background_color:classActive[index]}">
                                    <a :href="item.href">
                                        <p class="expands_title">{{item.title}}</p>
                                        <p class="expands_abstract">
                                            {{item.abstract}}
                                        </p>
                                    </a>
                                </li>
                                <p>所谓“互联网+”战略，是全国人大代表、腾讯董事会主席兼CEO马化腾向人大提出的四个建议之一，马化腾解释说，“互联网+”战略就是利用互联网的平台，利用信息通信技术，把互联网和包括传统行业在内的各行各业结合起来，在新的领域创造一种新的生态。紧接着，李克强总理在2015年政府工作报告中提出，“制定‘互联网+’行动计划，推动移动互联网、云计算、大数据、物联网等与现代制造业结合，促进电子商务、工业互联网和互联网金融健康发展，引导互联网企业拓展国际市场。”随后，在中国的社会经济中掀起了一股“互联网+X”的商业浪潮。其中，传统农业也站上了这个风口。农业是最古老的产业，也是最关乎国计民生的一个产业，相对于一日千里的互联网产业而言，农业的发展一直处于蜗速状态。如今，“互联网+”的大风吹来，技术的可行性与经济上的有利可图，使得这个古老的产业插上了智慧的翅膀，借东风而舞，产业升级一触即发。于是，一批如网易丁磊、京东刘强东、联想佳沃等产业资本巨头纷纷务农，而大北农、新希望、芭田股份等传统农业企业也纷纷启动互联网化改造，一批涉及互联网农业领域的个股也在资本市场上受到热捧。 
                                  茶叶作为一个农业产值已超千亿的产业，在互联网的大风下早已是躁动不安了。一方面，受到大环境变化带来的市场冲击，许多茶企、茶商业绩下滑较为严重，生存为艰；另一方面，以茶叶电商发展迅速、“互联网+茶叶”的新商业形态频出，不断地引爆行业热点。此外，茶叶食品安全问题不断遭到曝光，行业产生信任危机。在这个形势下，许多老板把互联网作为一根救命稻草，但对于如何实现“互联网+茶叶”的结合却又很迷茫，不知所措。时下，许多茶企为了挽回业绩因此将注意力多放在了电商、微店等直接产生销量的互联网渠道。但实际上，“互联网+茶叶”，不单是把茶叶搬到网上去售卖，而应该考虑通过互联网的力量对整个茶叶产业链的完善和革新。 
                                  首先，在生产方面，构建智慧农业生产过程。通过构建农业物联网、云服务、大数据分析来实现茶叶生产技术问题、产品标准化问题、茶叶质量安全问题以及生产全程可追溯问题等的解决。通过提高茶叶种植加工各个环节的信息化水平，保证产品标准化，并可实现自动化控制，降低成本，提高质量。近年来，茶产业深受农残问题的困扰，由于产业有品类无品牌的现状，导致“一颗老鼠屎坏了一</p>
                                <!--<li class="expands_li_background_color">信息流广告</li>-->
                            </ul>
                        </div>
                        <div class="button_box">
                            <span class="close" @click="close()"><img src="../assets/images/close2.png"
                                                                      alt=""></span><span
                                class="url" @click="toFront()"><img
                                src="../assets/images/back_to_original2.png" alt=""></span>
                        </div>
                    </div>
                </div>
            </mt-swipe-item>
        </mt-swipe>
    </div>
</template>
<script type="text/ecmascript-6">
    import action from '@/components/Action';
    import {mapState} from 'vuex';
    export default{
        data(){
            return {
                imageId: 0,
                images: [{article: {user: {}, topic: {},comments:{},agrees:{},opposes:{}}}],
                index: 0,
                show: true,
                classActive: [],
            }
        },
        computed: mapState(['url']),
        components: {
            action
        },
        methods: {
            getImages(){
                axios.get('/api/images', {params: {image_id: this.imageId}})
                        .then(response => {
                            console.log(response.data);
                            this.images = response.data;
                            for (var i = 0; i < this.images.length; i++) {
                                if (this.images[i].id == this.imageId) {
                                    this.index = i;
                                    break;
                                }
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        })
            },
            close: function () {
                this.$router.go(-1);
            },

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
                this.show = true;
                this.classActive = [];
                var expands = this.images[this.index].expands;
                for (var i = 0; i < expands.length; i++) {
                    this.classActive[i] = (expands[i].dimension == 'variant' || expands[i].dimension == 'implicit');
                }
            },

            imgClick: function () {

                this.show = (!this.show);
            },
            toFront: function () {
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

                this.show = true;
            },
        },
        mounted: function () {
            $('.show_box').height($(window).height());
            this.imageId = this.$route.params.id;
            this.getImages();
        }
    }
</script>
<style scoped lang="scss" rel="stylesheet/scss" type="text/css">
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

    .test {
        -webkit-animation: flipOutYtest 0.75s linear;
        animation: flipOutYtest 0.75s linear;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        height: 100%;
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

    .test2 {
        -webkit-animation: flipInYtest 0.75s linear;
        animation: flipInYtest 0.75s linear;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
    }
    @media screen and (max-height: 480px) {
      .back-content ul {
        height: 295px;
        overflow-y: scroll;
      }
      .bullet_screen .bullet_screen_content {
        width: 50%;
      }
    }
    @media screen and (min-height: 481px) and (max-height: 568px) {
        .back-content ul {
            height: 368px;
            overflow-y: scroll;
        }
        .bullet_screen .bullet_screen_content {
            width: 50%;
        }
    }

    @media screen and (min-height: 569px) and (max-height: 640px) {
        .back-content ul {
            height: 440px;
            overflow-y: scroll;
        }
        .bullet_screen .bullet_screen_content {
            width: 56%;
        }
    }

    @media screen and (min-height: 641px) and (max-height: 667px) {
        .back-content ul {
            height: 467px;
            overflow-y: scroll;
        }
        .bullet_screen .bullet_screen_content {
            width: 57%;
        }
    }

    @media screen and (min-height: 668px) and (max-height: 736px) {
        .back-content ul {
            height: 536px;
            overflow-y: scroll;
        }
        .bullet_screen .bullet_screen_content {
            width: 59%;
        }
    }

    /*图片show样式*/
    .show_box {
        position: relative;
        .front {
            width: 100%;
            height: 100%;
            z-index: 1;
            position: absolute;
            .img_original {
                width: 100%;
                position: absolute;
                left: 0;
              /*top:50%;*/
                z-index: 2;

            }
            .img_mark {
                width: 100%;
                position: absolute;
                left: 0;
              /*top:50%;*/
                z-index: 3;
            }
            .UserComment {
                width: 100%;
                text-align: left;
                font-size: 12px;
                color: #fff;
                background-color: #000;
                padding: 5px 15px;
                position: absolute;
                z-index: 4;
                top: 0;
                .head_img {
                    vertical-align: middle;
                    width: 20px;
                    height: 20px;
                    border-radius: 10px;
                    margin: 5px 0px;
                }
            }
            .button_box {
                position: absolute;
                bottom: 0;
                z-index: 4;
                height: 60px;
                width: 100%;
                background-color: #000;
                .show_action {
                    color: #fff;
                }
                .your_action {
                    width: 50%;
                    padding: 0;
                    float: left;
                    margin: 8px 0;
                    .your_action_right p {
                        background-color: #fff;
                    }
                }
                .bullet_screen_img {
                    width: 100%;
                    .close, .url {
                        float: right;
                        display: inline-block;
                        margin: 20px 0;
                        width: 15%;
                    }
                }
            }
        }
        .back {
            background-color: #fff;
            height: 100%;
            width: 100%;
            .expands_li_background_color {
                background-color: #b7d28d !important;
            }
            .back_box {
                height: 100%;
                .back-content {
                    margin: 0 15px;
                    color: #000;
                    .expands {
                        text-align: center;
                        font-size: 22px;
                        padding: 10px 0;
                    }
                    ul li {
                        text-align: left;
                        padding: 0 10px;
                        list-style: none;
                        line-height: 30px;
                        border-radius: 5px;
                        background-color: #bce8f1;
                        margin-bottom: 10px;
                        max-height: 140px;
                        min-height: 70px;
                        overflow: hidden;
                        a {
                            color: #000;
                            display: block;
                            .expands_title {
                                font-weight: 700;
                                font-size: 20px;
                                height: 30px;
                                line-height: 30px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            .expands_abstract {
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
                .button_box {
                    width: 100%;
                    height: 60px;
                    background-color: #000;
                    position: fixed;
                    bottom: 0;
                    span {
                        float: right;
                        display: inline-block;
                        width: 15%;
                        margin: 20px 0;
                    }
                }
            }
        }
    }
</style>
