<template>
    <router-view></router-view>
</template>

<script>
    export default{
        data:function () {
            return{
                userId:0
            }
        },
        methods: {
            checkLogin(){
                this.userId = localStorage.id;
                if (this.userId == null) {
                    localStorage.url=window.location.href;
                    window.location.href = '/flwechat/public/getuser';
                } else {
                    this.$store.commit('setUserId',this.userId);
                }
            }
        },
        created: function () {
            this.checkLogin();
        }
    }
</script>