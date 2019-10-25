import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'front',
            component: () => import(/* webpackChunkName: "front" */ './views/Front.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
        },
        {
            path: '/login-redirect',
            name: 'login-redirect',
            component: () => import(/* webpackChunkName: "login-redirect" */ './views/LoginRedirect.vue'),
        },
        {
            path: '/account',
            name: 'account',
            component: () => import(/* webpackChunkName: "account" */ './views/Account.vue'),
        },
        {
            path: '/register',
            name: 'register',
            component: () => import(/* webpackChunkName: "register" */ './views/Register.vue'),
        },
        // #if !production
        {
            path: '/test',
            name: 'test',
            component: () => import(/* webpackChunkName: "test" */ './views/Test.vue'),
        },
        // #endif
    ],
});
