import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.VUE_APP_WEBSITE_PATH || '/',
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
            path: '/me',
            name: 'me',
            component: () => import(/* webpackChunkName: "me" */ './views/Me.vue'),
        },
        {
            path: '/account/loginshield/continue-registration',
            name: 'account-loginshield-continue-registration',
            component: () => import(/* webpackChunkName: "account-loginshield-continue-registration" */ './views/AccountLoginShieldContinueRegistration.vue'),
        },
        /*
        {
            path: '/account/loginshield/continue-login',
            name: 'account-loginshield-continue-login',
            component: () => import(/ * webpackChunkName: "account-loginshield-continue-login" * / './views/AccountLoginShieldContinueLogin.vue'),
        },
        */
        {
            path: '/create',
            name: 'create',
            component: () => import(/* webpackChunkName: "create" */ './views/Create.vue'),
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

router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0);
    next();
});

export default router;
