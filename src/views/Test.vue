<template>
    <v-container>
        <v-row justify="center" class="pa-5 pb-10">
                <h1 class="overline" style="font-size: 34px!important;">Test</h1>
        </v-row>
        <v-row justify="center" class="pb-10">
            <v-col cols="12" sm="9" md="6" lg="4" xl="3" class="pa-0">
                <!-- Set these panels state as opened by default if possible (see value) -->
                <v-expansion-panels accordion multiple v-model="isExpansionPanelOpen">
                    <v-expansion-panel style="border-radius: 0px;">
                        <v-expansion-panel-header class="overline" style="font-size: 18px!important;">States</v-expansion-panel-header>
                        <v-divider></v-divider>
                        <v-expansion-panel-content>
                            <v-tabs hide-slider vertical class="menutabs">
                                <v-tab v-show="false"></v-tab>
                                <v-tab @click="state('isAuthenticated')">Authenticated</v-tab>
                                <v-tab @click="state('nonAuthenticated')">Non-Authenticated</v-tab>
                            </v-tabs>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel style="border-radius: 0px;">
                        <v-expansion-panel-header class="overline justify-center" style="font-size: 18px!important;">Navigation</v-expansion-panel-header>
                        <v-divider></v-divider>
                        <v-expansion-panel-content>
                            <v-tabs hide-slider vertical class="menutabs">
                                <v-tab v-show="false"></v-tab>
                                <v-tab @click="goto('/select-profile?from=openid&interaction=testInteraction&prompt=login')">Select Profile</v-tab>
                                <v-tab @click="goto('/login')">Login</v-tab>
                                <v-tab @click="goto('/login?mode=qr')">Login (QR)</v-tab>
                            </v-tabs>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="12" class="pa-0">
                <v-expansion-panels accordion multiple>
                    <v-expansion-panel style="border-radius: 0px;">
                        <v-expansion-panel-header class="overline justify-center" style="font-size: 18px!important;">Vuex</v-expansion-panel-header>
                        <v-divider></v-divider>
                        <v-expansion-panel-content>
                            <v-card-text>
                                <h1>State</h1>
                                <pre>{{vuexStateJson}}</pre>
                                <h1>Getters</h1>
                                <pre>{{vuexGettersJson}}</pre>
                            </v-card-text>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel style="border-radius: 0px;">
                        <v-expansion-panel-header class="overline justify-center" style="font-size: 18px!important;">API</v-expansion-panel-header>
                        <v-divider></v-divider>
                        <v-expansion-panel-content>
                            <!-- TOOD:  one button for each state we want to put in the application,  so 1) enter that state, and 2)  route to any page we want to see with that state -->
                            <v-card-text>
                                <h1>Service version</h1>
                                <pre>{{serviceVersionJson}}</pre>
                                <h1>Service context</h1>
                                <pre>{{serviceContextJson}}</pre>
                                <h1>Current session</h1>
                                <pre>{{sessionJson}}</pre>
                                <h1>Account</h1>
                                <pre>{{accountJson}}</pre>
                            </v-card-text>
                            <v-card-title primary-title>Local Storage</v-card-title>
                            <v-card-text><pre>{{localStorageJson}}</pre></v-card-text>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>

    </v-container>
</template>

<style scoped>
.v-card__title {
    font-weight: normal;
    font-size: 2em;
    text-align: left;
}
.v-card__text h1 {
    font-weight: normal;
    font-size: 1.2em;
    text-align: left;
    margin-top: 10px;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex';
import { Client } from '@/client';

const client = new Client();

const TestModule = {
    state: {
        test: {}, // request => response
    },
};


export default {
    components: {

    },
    data() {
        return {
            isExpansionPanelOpen: [0, 1],
            serviceContextJson: null,
            serviceVersionJson: null,
            sessionJson: null,
            accountJson: null,
            localStorageInfo: {},
        };
    },
    computed: {
        localStorageJson() {
            return JSON.stringify(this.localStorageInfo, null, 2);
        },
        ...mapState({
            isReady: state => state.isReady,
            context: state => state.context,
            session: state => state.session,
            accountMap: state => state.account,
        }),
        ...mapGetters({
            account: 'account',
        }),
        vuexStateJson() {
            return JSON.stringify({
                isReady: this.isReady,
                session: this.session,
                account: this.account,
            }, null, 2);
        },
        vuexGettersJson() {
            return JSON.stringify({
                account: this.account,
            }, null, 2);
        },
    },
    created() {
        this.init();
        // https://vuex.vuejs.org/guide/modules.html
        this.$store.registerModule('test', TestModule);
    },
    methods: {
        async init() {
            this.readLocalStorage();
            this.getServiceInfo();
        },
        getServiceInfo() {
            client.service.getContext().then(((response) => {
                this.serviceContextJson = JSON.stringify(response, null, 2);
            }))
                .catch(((response) => {
                    this.serviceContextJson = JSON.stringify({ error: response.message }, null, 2);
                }));
            client.service.getVersion().then(((response) => {
                this.serviceVersionJson = JSON.stringify(response, null, 2);
            }))
                .catch(((response) => {
                    this.serviceVersionJson = JSON.stringify({ error: response.message }, null, 2);
                }));

            client.session.get().then(((response) => {
                this.sessionJson = JSON.stringify(response, null, 2);
                this.csrfGuardToken = response.csrfGuardToken;
                console.log('getServiceInfo: csrfGuardToken: %s', this.csrfGuardToken);
            }))
                .catch(((response) => {
                    this.sessionJson = JSON.stringify({ error: response.message }, null, 2);
                }));
            client.account.get().then(((response) => {
                this.accountJson = JSON.stringify(response, null, 2);
            }))
                .catch(((response) => {
                    this.accountJson = JSON.stringify({ error: response.message }, null, 2);
                }));
        },
        readLocalStorage() {
            this.localStorageInfo = [];
            const localStorageKeys = ['csrfGuardToken', 'optin'];
            localStorageKeys.forEach((item) => { this.localStorageInfo[item] = localStorage.getItem(item); });
        },
        state(name) {
            const { csrfGuardToken } = this;
            console.log('reset state: csrfGuardToken: %s', csrfGuardToken);
            switch (name) {
            case 'nonAuthenticated':
                this.$store.commit('setSession', {
                    isAuthenticated: false,
                    notAfter: null,
                });
                this.$store.commit('setUser', {});
                this.$store.commit('setAccount', {});
                this.$store.commit('ready');
                break;
            case 'isAuthenticated':
                this.$store.commit('setSession', {
                    isAuthenticated: true,
                    notAfter: 1570227765710,
                });
                this.$store.commit('setAccount', {
                    username: 'sparky',
                    email: 'sparky@example.com',
                });
                this.$store.commit('ready');
                break;
            default:
                console.log('unknown state name');
            }
        },
        goto(path) {
            this.$router.push(path); // push({ path, query: { test: true } });
        },
    },
};
</script>
