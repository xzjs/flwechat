// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import routes from './router'
import store from './store'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import '@/assets/css/weui.min.css'

Vue.config.productionTip = false;
Vue.config.debug = true;

import jQuery from 'jquery'
window.$ = window.jQuery = jQuery;

Vue.use(VueRouter);
Vue.use(MintUI);

const router = new VueRouter({
    routes
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App},
})
;
