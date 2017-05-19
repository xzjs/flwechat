<template>
    <router-view></router-view>
</template>

<script>
    export default{
        data: function () {
            return {
                token: 0
            }
        },
        methods: {
            checkLogin(){
                this.token=localStorage.token;
                if (this.token == null) {
                    window.location.href = process.env.API_ROOT + '/wechat/getuser?callback=' + window.location.host;
                } else {
                    this.$store.commit('setUserId', this.userId);
                }
            }
        },
        created: function () {
            this.checkLogin();
        },
        mounted() {
            this.checkLogin();
        }
    }
</script>