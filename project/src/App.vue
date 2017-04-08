<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  methods: {
    checkLogin(){
      var userId = localStorage.userId;
      if (userId == null) {
        userId = this.getQueryString('id');
      }
      if (userId == null) {
        var url=window.location.href;
        window.location.href = 'http:/localhost/flwechat/public/getuser/'+url;
      }else{
        localStorage.userId=userId;
        this.$store.commit(userId);
      }
    },
    getQueryString(name){
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null)return decodeURI(r[2]);
      return null;
    },

  },
  created: function () {
    this.checkLogin();
  }

}
</script>
