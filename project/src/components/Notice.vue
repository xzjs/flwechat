<template>
    <div>
        <mt-cell-swipe v-for="notice in notices" :key="notice.id"
                       :title="getTitle(notice)"
                       :right="[
    {
      content: '标记为已读',
      style: { background: '#0084FF', color: '#fff' },
      handler: ()=>updateNotices(notice.id)
    }
  ]"></mt-cell-swipe>
    </div>
</template>

<script>
    import {mapState, mapMutations,mapActions} from 'vuex';
    import { Toast } from 'mint-ui';

    export default{
        computed: mapState(['notices']),
        methods: {
            ...mapMutations(['markNotices']),
            ...mapActions(['updateNotices']),
            getTitle: notice=> {
                let types = ['评论', '赞', '踩'];
                let data = notice.data;
                return data.user_name + types[data.type] + '了你的文章';
            },
            updateNotices: id=> {
                var vm=this;
                axios.put('/api/notices/' + id)
                        .then(response=> {
                            if (response.data == true) {
                                var index = 0;
                                for (var i = 0; i < vm.notices.length; i++) {
                                    if (vm.notices[i].id == id) {
                                        index = i;
                                        break;
                                    }
                                }
                                this.markNotices(index);
                            }else{
                                Toast('标记失败');
                            }
                        })
                        .catch(error=>{
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