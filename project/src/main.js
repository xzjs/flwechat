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
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

Vue.config.productionTip = false;
Vue.config.debug = true;

import jQuery from 'jquery'
window.$ = window.jQuery = jQuery;

import VueEcho from 'vue-echo';

Vue.use(VueEcho, {
    broadcaster: 'pusher',
    key: '53d2c65d354b5542d329',
    cluster: 'ap1',
    encrypted: true,
    auth: {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': 'Bearer ' + localStorage.token
        }
    },
    authEndpoint: process.env.API_ROOT+'/broadcasting/auth',
});

Vue.use(VueRouter);
Vue.use(MintUI);
Vue.use(ElementUI);

const router = new VueRouter({
    routes,

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
