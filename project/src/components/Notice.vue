<template>
    <div v-if="show">
        <mt-cell-swipe v-for="(notice,index) in notices" :key="notice.id"
                       :title="getTitle(notice)"

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
            ...mapMutations(['markNotice']),
            ...mapActions(['updateNotices', 'getNotices']),
            getTitle(notice){
                let types = ['评论', '赞', '踩'];
                let data = notice.data;
                return data.user_name + types[data.method] + '了你的文章';
            },
            updateNotices(index, notice) {
                axios.put('/api/notices/' + notice.id)
                        .then(response=> {
                            if (response.data == true) {
                                this.markNotice(index);
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
            this.getNotices()
                    .then(()=> {
                        if (this.notices.length > 0) {
                            this.show = true;
                        }
                    })
        },
        data(){
            return {
                show: false,
        }
        }
    }
</script>

<style scoped>

</style>