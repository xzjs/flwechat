<template>
    <div class="content_box">
        <div v-cloak v-for="item in article_list" class="content" :class="{comment_bg:is_comment}">
            <div class="content_top">
                <router-link :to="{name:'Mine',params:{id:item.user.id}}">
                    <img :src="item.user.head_img" alt="" class="head_portrait"><span class="wei_name">{{item.user.nickname}}&bull;<span>{{item.topic.content}}</span></span>
                </router-link>
            </div>
            <div v-if="item.is_deleted==0">
                <router-link :to="{name:'Detail',params:{id:item.id}}">
                    <p class="content_txt">{{item.content}}</p>
                </router-link>
                <images :images="item.images"></images>
            </div>
            <a v-else :href="'article_detail.html?reply_id='+item.id"><p class="content_txt">该文章已被作者删除</p></a>
            <action :article="item" :is_comment="is_comment"></action>
        </div>
    </div>
</template>


<script>
    import action from '@/components/Action';
    import images from '@/components/Image'

    export default {
        props: {
            article_list:{},
            is_comment: {
                default: false
            }
        },
        components: {
            action,
            images
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .content_box {
        padding-bottom: 80px;
        overflow: hidden;

    }

    .content {
        /*padding:0 15px;*/
        border-bottom: 6px solid #e8e8e8;
        overflow: hidden;
        background-color: #fff;
    }

    .content_top {
        padding: 0 15px;
        position: relative;
        height: 30px;
        line-height: 30px;
    }

    .head_portrait {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        border-radius: 10px;
        margin-top: -4px;
        vertical-align: middle;
    }

    .wei_name {
        font-size: 14px;
        color: #888888;
    }

    .content_txt {
        padding: 0 15px;
        font-size: 18px;
        line-height: 32px;
    }

    .comment_bg{
        background-color: #f5f5f5;
        border-bottom: 1px solid  #e8e8e8;
    }
</style>
