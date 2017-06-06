<template>
    <div>
        <mt-cell-swipe v-for="(notice,index) in notices" :key="notice.id"
                       :title="getTitle(notice)"
                       :is-link="true"
                       :to="{name:'Detail',params:{id:notice.data.article_id}}"
                       :right="[
    {
      content: '标记为已读',
      style: { background: '#0084FF', color: '#fff' },
      handler: ()=>updateNotices(index,notice)
    }
  ]"></mt-cell-swipe>
    </div>
</template>

<script>
    import {mapState, mapMutations, mapActions} from 'vuex';
    import {Toast} from 'mint-ui';

    export default{
        computed: mapState(['notices']),
        methods: {
            ...mapMutations(['markNotices']),
            ...mapActions(['updateNotices']),
            getTitle(notice){
                let types = ['评论', '赞', '踩'];
                let data = notice.data;
                return data.user_name + types[data.type] + '了你的文章';
            },
            updateNotices(index,notice) {
                axios.put('/api/notices/' + notice.id)
                        .then(response=> {
                            if (response.data == true) {
                                this.markNotices(index);
                            } else {
                                Toast('标记失败');
                            }
                        })
                        .catch(error=> {
                            console.log(error);
                            Toast('标记失败');
                        })
            }
        },
        mounted: function () {
        }
    }
</script>

<style scoped>

</style>