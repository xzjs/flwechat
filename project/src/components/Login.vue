<template></template>

<script>
    export default{
        methods: {
            login:function () {
                localStorage.id=this.$route.params.id;
                this.$router.push('/');
            }
        },
        created: function () {
            this.login();
        }
    }
</script>