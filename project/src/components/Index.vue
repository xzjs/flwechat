<template>
    <div class="container">
        <div class="weui-search-bar" id="searchBar">
            <form class="weui-search-bar__form" onsubmit="return check()">
                <div class="weui-search-bar__box">
                    <i class="weui-icon-search"></i>
                    <input type="search" class="weui-search-bar__input" id="searchInput" placeholder="搜索" required="">
                    <a href="javascript:" class="weui-icon-clear" id="searchClear"></a>
                </div>
                <label class="weui-search-bar__label" id="searchText">
                    <i class="weui-icon-search"></i>
                    <span>搜索</span>
                </label>
            </form>
            <a href="javascript:" class="weui-search-bar__cancel-btn" id="searchCancel">取消</a>
        </div>
        <nav class="topic_index_box">
            <router-link to="/index" class="topic_index topic_index_selected recommend">全部</router-link>
            <router-link v-for="item in topic_list" to="/index" class="topic_index">
                {{item.content}}
            </router-link>
        </nav>
        <div class="more_topic">
            <img src="../../static/images/more.png" alt="" class="more">
            <img src="../../static/images/up_close.png" alt="" class="close" style="display: none">
        </div>

        <!--<div class="content_box"></div>-->
    </div>
</template>

<script>

    export default{
        data(){
            return {

            }
        },
        computed:{
            topic_list(){
                return this.$store.state.topics
            }
        },
        created(){
            this.getTopics()
        },
        methods: {
            getTopics(){
                this.$store.dispatch('getTopics')
            }
        }
    }
</script>

<style scoped>
    *:focus{
        outline:none;
    }
    .container{
        /*background-color: #fff;*/
        padding-bottom:84px;
    }
    .weui-search-bar{
        width:100%;
        position: fixed;
        top:0;
        z-index: 100;
    }
    .topic_index_box{
        background-color: #f8f8f8;
        height: 30px;
        line-height: 28px;
        margin-top: 44px;
        overflow: hidden;
    }
    .topic_index{
        display: inline-block;
        text-align: center;
        padding:0px 10px;
    }
    .topic_index_selected{
        color: #09bb07;
        border-bottom:2px solid #09bb07;
    }
    .more_topic{
        height:30px;
        width:30px;
        text-align: right;
        position: absolute;
        top:45px;
        right:15px;
        line-height: 30px;
    }
    .more,.close{
        width:20px;
    }


    a{
        color: #000;
    }


    .pic_show img{
        width:100px;
    }

    @media screen and (max-width: 320px){
        .pic_show img{
            width:90px;
        }
    }
    .url_list a{
        overflow: hidden;
        height:30px;
        border-bottom: 1px solid #fff;
        padding: 0 5px;
        color: #fff;
        display: block;
    }
    .bullet_screen_button span{
        color: #fff;
        background: none;
        margin:0 5px;
    }
    .bullet_screen .bullet_screen_content{
        position: absolute;
        right:60px;
        padding:0 5px;
        font-size: 16px;
        color: #000;
        display: inline-block;
        width:56%;
        height:35px;
        line-height: 35px;
        float: right;
        border: none;
        margin-bottom: 10px;
    }

    /*操作按钮*/
    .your_action .your_action_left{
        width:14%;
        line-height: 30px;
        position: absolute;
        left:15px;
    }
    .your_action .your_action_right{
        width:14%;
        line-height: 30px;
        float: right;
        text-align: center;
    }
    .your_action img{
        width:16px;
        height:16px;
        margin-right: 2px;
    }
    .your_action span{
        font-size: 10px;
        color: #8a8a8a;
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