<template>
    <v-container class="py-10 px-2">
        <!-- TODO: we need a title for optin (like Profile Management is what we show in Profile.vue) we need to show a message here that user must optin to use the service, AND we need to disable all other account functions until we have an optin -->
        <div v-if="profileList.length === 0">
            <v-row justify="center"  class="py-5">
                <v-col style="text-align: center">
                    <h2 class="display-2 font-weight-light">Start using LoginShield:</h2>
                </v-col>
            </v-row>
            <v-row justify="center" class="py-5 pb-10">
                <OptIn :requireInputs="['name','email']" @opt-in="afterOptIn"/>
            </v-row>
        </div>
        <v-row justify="center" v-if="loading">
            <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                <div class="pa-5 text-center">
                    <p class="headline font-weight-light">Loading...</p>
                    <v-progress-circular indeterminate class="mt-5 center" color="blue" size="96"></v-progress-circular>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
// import { Client } from '@/client';

export default {
    data() {
        return {
            isViewReady: false,
            loading: false,
        };
    },
    methods: {
        async init() {
            console.log('LoginRedirect.vue: isReady: %o', this.isReady);
            if (this.isAuthenticated) {
                if (this.pendingAction === 'transfer_prompt') {
                    console.log('loginredirect.vue: displaying transfer prompt for authenticated user');
                    this.isViewReady = true;
                } else if (this.pendingAction === 'link_account_user') {
                    // for authenticated and non-authenticated users, we redirect to the invitation page
                    this.$router.push('/link-account-user');
                } else {
                    this.forward();
                }
            } else {
                console.log('loginredirect.vue: user is not authenticated, pendingAction: %s', this.pendingAction);
                if (this.pendingAction === 'link_device' || this.pendingAction === 'link_account_user') {
                    console.log('loginredirect.vue: posting gateway public key for non-authenticated user');
                    // with pendingAction 'link_device' in a non-authenticated session,
                    // server will know to store the gateway public key in the session
                    // now and automatically copy it to the user account when it is created
                    // later in the same session
                    this.loading = true;
                    // await gatewayClient.postGatewayPublicKeyIfNotStored();
                    this.loading = false;
                    // non-authenticated users with a link_device status might be new users
                    // following the quickstart registration steps, or they might be existing
                    // users following an invitation email from an enterprise account;
                    // since they are not logged in we don't know which it is, so we forward
                    // them to the quickstart software page; existing users can then just click
                    // 'got it' and continue to login
                    if (this.pendingAction === 'link_device') {
                        console.log('loginredirect.vue: non-authenticated user with pendingAction link_device, redirecting to quickstart software page');
                        this.$router.push('/quickstart?step=software');
                    }
                    if (this.pendingAction === 'link_account_user') {
                        // for authenticated and non-authenticated users, we redirect to the invitation page
                        console.log('loginredirect.vue: redirecting to link account user page');
                        this.$router.push('/link-account-user'); // TODO: add token id (not the token itself) which should also be stored in session by backend in a map , sto be verified by the accept API,  and this way user could have multiple invitations pending , but following the link leads to that specific invitation info.
                    }
                } else {
                    console.log('loginredirect.vue: displaying login link for non-authenticated user');
                    this.isViewReady = true;
                }
            }
        },
        async forward() {
            console.log('loginredirect.vue: forward: pendingAction: %s', this.pendingAction);
            if (this.pendingAction === 'link_device') {
                // authenticated users with a link_device status might be following an invitation email from an enterprise; since they already have the software, we redirect to the login page
                console.log('loginredirect.vue: authenticated user with pendingAction link_device, redirecting to login');
                this.$router.push('/login');
            }
            if (!this.pendingAction && this.profileList.length > 0) {
                console.log('loginredirect.vue: calling forward...');
                const forward = await this.$store.dispatch('nextNavItem');
                console.log('loginredirect.vue: forward: %o', forward);
                this.$router.push(forward);
            }
            // NOTE: if pendingAction === 'transfer_prompt', or if
            // there's no pendingAction but profileList.length ===0,
            // we stay on this page for safety notice
        },
    },
    computed: {
        ...mapState({
            isReady: state => state.isReady,
            session: state => state.session,
        }),
        ...mapGetters({
            currentAccount: 'account',
        }),
        isAuthenticated() {
            return this.session.isAuthenticated;
        },
        pendingAction() {
            return this.session.pendingAction;
        },
        profileListJson() {
            return JSON.stringify(this.profileList, null, 2);
        },
    },
    watch: {
        isReady(value, oldValue) {
            console.log('loginredirect.vue: isReady changed from %o to %o', oldValue, value);
            // only call init again if ready changed from false to true after mounted()
            if (value && !oldValue) {
                this.init();
            }
        },
    },
    mounted() {
        console.log('loginredirect.vue: mounted');
        if (this.isReady) {
            this.init();
        }
    },
};
</script>
