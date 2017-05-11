<template></template>

<script>
    export default{
        methods: {
            login:function () {
                //localStorage.id=this.$route.params.id;
                localStorage.token=this.$route.params.token;
                this.$router.push('/');
            }
        },
        created: function () {
            this.login();
        }
    }
</script>