webpackJsonp([7,12],{111:function(t,e,n){var o=n(39)(n(189),n(274),null,null);t.exports=o.exports},189:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={data:function(){return{token:0}},methods:{checkLogin:function(){this.token=localStorage.token,null==this.token?window.location.href="//api.frilink.cn/wechat/getuser?callback="+window.location.host:this.$store.commit("setUserId",this.userId)}},created:function(){this.checkLogin()},mounted:function(){this.checkLogin()}}},274:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("router-view")},staticRenderFns:[]}}});
//# sourceMappingURL=7.6e912d030ae2bedafdab.js.map