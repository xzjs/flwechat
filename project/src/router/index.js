import App from '../App.vue';

const Hello = resolve=>require(['../components/Hello'], resolve);
const Navigation = resolve=>require(['../components/Navigation'], resolve);
const Index = resolve=>require(['../components/Index'], resolve);
const Main = resolve=>require(['../components/Main'], resolve);
const Login = resolve=>require(['../components/Login'], resolve);
const Detail = resolve=>require(['../components/Detail'], resolve);
const Mine = resolve=>require(['../components/Mine'], resolve);
const Show = resolve=>require(['../components/Show'], resolve);
const Friend = resolve=>require(['../components/Friend'], resolve);


export default [{
    path: '/',
    component: App,
    children: [
        {
            path: '/hello',
            name: 'Hello',
            component: Hello
        },
        {
            path: '',
            redirect: '/main/nav/index/0'
        },
        {
            path: '/main',
            component: Main,
            children: [
                {
                    path: 'nav',
                    component: Navigation,
                    children: [
                        {
                            path: 'index/:topic_id',
                            name: 'Index',
                            component: Index
                        },
                        {
                            path: 'detail/:id',
                            name: 'Detail',
                            component: Detail
                        },
                        {
                            path: 'friend',
                            name: 'Friend',
                            component: Friend
                        },
                        {
                            path: 'mine/:id?',
                            name: 'Mine',
                            component: Mine
                        }
                    ]
                },
                {
                    path: 'show/:id',
                    name: 'Show',
                    component: Show
                }
            ]
        },
        {
            path: '/login/:id',
            name: 'Login',
            component: Login
        }
    ]
}]
