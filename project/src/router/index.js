import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Navigation from '@/components/Navigation'
import Index from '@/components/Index'
import Main from '@/components/Main'
import Login from '@/components/Login'
import Detail from '@/components/Detail'
import Mine from '@/components/Mine'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/hello',
            name: 'Hello',
            component: Hello
        },
        {
            path:'',
            redirect:'/main/nav/index/0'
        },
        {
            path:'/main',
            component:Main,
            children:[
                {
                    path:'nav',
                    component:Navigation,
                    children:[
                        {
                            path:'index/:topic_id',
                            name:'Index',
                            component:Index
                        },
                        {
                            path:'detail/:id',
                            name:'Detail',
                            component:Detail
                        },
                        {
                            path:'mine/:id?',
                            name:'Mine',
                            component:Mine
                        }
                    ]
                },
                {
                    path:'show/:id',

                }
            ]
        },
        {
            path:'/login/:id',
            name:'Login',
            component:Login
        }
    ]
})
