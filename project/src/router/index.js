import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Navigation from '@/components/Navigation'
import Index from '@/components/Index'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/hello',
            name: 'Hello',
            component: Hello
        },
        {
            path:'/',
            name:'Navigation',
            component:Navigation,
            // children:[
            //     {
            //         path:'/index/:type',
            //         name:'Index',
            //         component:Index,
            //     },
            //     {
            //         path:'/follow/',
            //         name:'Follow',
            //         component:Index,
            //     }
            // ]
        }
    ]
})
