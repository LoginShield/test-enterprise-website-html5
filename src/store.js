import Vue from 'vue';
import Vuex from 'vuex';

import { Client } from '@/client';

const client = new Client();

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isReady: false, // indicates that we loaded session info from server, so we know if user is authenticated; and if user is authenticated, that we've also loaded user info and account info from server
        serviceContext: {}, // stripeTokenPublicKey
        serviceVersion: {}, // version
        session: { isAuthenticated: false },
        account: { username: null, email: null, loginshield: { isRegistered: false, isEnabled: false } },
        loadingMap: { loadSession: true },
    },
    getters: {
        isLoading(state) {
            return Object.values(state.loadingMap).reduce((acc, item) => acc || item, false);
        },
        isAuthenticated(state) {
            return state.session.isAuthenticated;
        },
    },
    mutations: {
        ready(state) {
            console.log('vuex store: ready');
            state.isReady = true;
        },
        setServiceContext(state, contextInfo) {
            state.serviceContext = contextInfo;
        },
        setServiceVersion(state, versionInfo) {
            state.serviceVersion = versionInfo;
        },
        setSession(state, session) {
            state.session = session;
        },
        setAccount(state, account) {
            state.account = account;
        },
        loading(state, progress) {
            state.loadingMap = { ...state.loadingMap, ...progress };
        },
    },
    actions: {
        async login({ commit, dispatch, state }, { username }) {
            commit('loading', { login: true });
            const { isAuthenticated, mechanism } = await client.session.login({ username });
            // https://vuex.vuejs.org/guide/mutations.html#mutations-follow-vue-s-reactivity-rules
            commit('setSession', { ...state.session, isAuthenticated });
            if (isAuthenticated) {
                await dispatch('loadAccount');
            }
            commit('loading', { login: false });
            return { isAuthenticated, mechanism };
        },
        async loginWithPassword({ commit, dispatch, state }, { username, password }) {
            commit('loading', { loginWithPassword: true });
            const { isAuthenticated, error } = await client.session.loginWithPassword({ username, password });
            // https://vuex.vuejs.org/guide/mutations.html#mutations-follow-vue-s-reactivity-rules
            commit('setSession', { ...state.session, isAuthenticated });
            if (isAuthenticated) {
                await dispatch('loadAccount');
            }
            commit('loading', { loginWithPassword: false });
            return { isAuthenticated, error };
        },
        async loginWithLoginShield({ commit, dispatch, state }, { username, mode, verifyToken }) {
            commit('loading', { loginWithLoginShield: true });
            // NOTE: username and mode are used to initiate a login; token is used to finish a login request
            const {
                isAuthenticated, challenge /* draft 1 */, error, forward /* draft 2 */,
            } = await client.session.loginWithLoginShield({ username, mode, verifyToken });
            // https://vuex.vuejs.org/guide/mutations.html#mutations-follow-vue-s-reactivity-rules
            commit('setSession', { ...state.session, isAuthenticated });
            if (isAuthenticated) {
                await dispatch('loadAccount');
            }
            commit('loading', { loginWithLoginShield: false });
            return {
                isAuthenticated, challenge, error, forward,
            };
        },
        async logout({ commit, state }) {
            commit('loading', { logout: true });
            await client.session.logout();
            // https://vuex.vuejs.org/guide/mutations.html#mutations-follow-vue-s-reactivity-rules
            commit('setSession', { ...state.session, isAuthenticated: false });
            commit('loading', { logout: false });
        },
        async init({ commit, dispatch, state }, { force = false } = {}) {
            if (state.isReady && !force) {
                console.log('vuex store: init already done');
                return;
            }
            console.log('vuex store: init');
            try {
                await Promise.all([
                    dispatch('loadServiceInfo'),
                    dispatch('loadSession'),
                ]);
                if (state.session.isAuthenticated) {
                    // load data concurrently
                    await Promise.all([
                        dispatch('loadAccount'),
                    ]);
                }
                commit('ready');
            } catch (err) {
                console.error('vuex store: init failed');
            }
        },
        async loadServiceInfo({ commit }) {
            commit('loading', { loadServiceInfo: true });
            try {
                const [versionInfo, contextInfo] = await Promise.all([
                    client.service.getVersion(),
                    client.service.getContext(),
                ]);
                commit('setServiceVersion', versionInfo);
                commit('setServiceContext', contextInfo);
            } catch (err) {
                console.error('vuex store: failed to load service info');
            }
            commit('loading', { loadServiceInfo: false });
        },
        async loadSession({ commit }) {
            commit('loading', { loadSession: true });
            try {
                const sessionInfo = await client.session.get();
                commit('setSession', sessionInfo);
            } catch (err) {
                commit('setSession', { fault: { type: 'read-failed' } });
            }
            commit('loading', { loadSession: false });
        },
        async loadAccount({ commit }) {
            commit('loading', { loadAccount: true });
            try {
                const accountInfo = await client.account.get();
                commit('setAccount', accountInfo);
            } catch (err) {
                commit('setAccount', { fault: { type: 'read-failed' } });
            }
            commit('loading', { loadAccount: false });
        },
        async editAccount({ commit, state }, accountInfo) {
            let response;
            commit('loading', { editAccount: true });
            try {
                const { isEdited, forward } = await client.account.edit(accountInfo);
                if (isEdited) {
                    // https://vuex.vuejs.org/guide/mutations.html#mutations-follow-vue-s-reactivity-rules
                    const newAccountInfo = { ...state.account, ...accountInfo };
                    commit('setAccount', newAccountInfo);
                }
                response = { isEdited, forward };
            } catch (err) {
                console.log('editUser error: %o', err);
                response = { error: true };
            }
            commit('loading', { editAccount: false });
            return response;
        },
        async createAccount({ commit, dispatch, state }, accountInfo) {
            commit('loading', { createAccount: true });
            const response = await client.account.register(accountInfo);
            if (response.isCreated) {
                await dispatch('loadSession');
                if (state.session.isAuthenticated) {
                    await dispatch('loadAccount');
                }
            }
            commit('loading', { createAccount: false });
            return response;
        },
    },
});
