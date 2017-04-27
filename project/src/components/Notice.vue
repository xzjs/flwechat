<template>
    <div>
        <mt-cell-swipe v-for="notice in notices" :key="notice.id"
                       :title="getTitle(notice)"
                       :right="[
    {
      content: '标记为已读',
      style: { background: 'green', color: '#fff' },
      handler: () => this.$messagebox('delete')
    },
    {
      content: '删除',
      style: { background: 'red', color: '#fff' },
      handler: () => this.$messagebox('delete')
    }
  ]"></mt-cell-swipe>
    </div>
</template>

<script>
    import {mapState,mapActions} from 'vuex';

    export default{
        computed: mapState(['notices']),
        methods:{
                ...mapActions(['getNotices']),
            getTitle:notice=> {
                let types=['评论','赞','踩'];
                let data=notice.data;
                return data.user_name+types[data.type]+'了你的文章';
            }
        },
        mounted:function () {
            this.getNotices();
        }
    }
</script>

<style scoped>

</style>