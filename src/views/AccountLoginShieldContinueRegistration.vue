<template>
    <v-container class="py-10 px-2">
        <v-row justify="center" class="py-5">
            <h1 class="display-1 font-weight-light">Account</h1>
        </v-row>
        <v-row justify="center" class="py-5">
            <v-col cols="12" sm="10" md="8" lg="6" xl="4">
                <v-card tile elevation="6" class="px-10 pb-5">
                    <v-card-text class="title text-center">Security</v-card-text>
                    <v-divider class="mx-5 mb-5"></v-divider>
                    <v-row justify="center" class="pt-5 px-5">
                        <p>Now login once with LoginShield to complete the registration process:</p>
                    </v-row>
                    <v-row justify="center" class="pt-5 px-5">
                        <p class="font-weight-light text-center">
                            Username: {{account.username}}
                        </p>
                    </v-row>
                    <v-row justify="center" class="pt-5 px-5">
                        <p class="font-weight-light text-center">
                            Email: {{account.email}}
                        </p>
                    </v-row>
                    <v-row justify="center" class="pt-5 px-5">
                        <v-btn tile elevation="6" class="blue white--text" @click="login">
                            Login
                        </v-btn>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    data() {
        return {
        };
    },

    computed: {
        ...mapState({
            isReady: state => state.isReady,
            session: state => state.session,
            account: state => state.account,
        }),
        ...mapGetters({
            isAuthenticated: 'isAuthenticated',
        }),
        loginshield() {
            if (this.account && this.account.loginshield) {
                return this.account.loginshield;
            }
            return { isRegistered: false, isEnabled: false };
        },
    },

    watch: {
        isReady(value, oldValue) {
            if (value && !oldValue) {
                this.init();
            }
        },
    },

    methods: {
        init() {
            if (!this.isAuthenticated) {
                this.$router.push('/login');
            }
        },
        login() {
            // TODO: login with special flag to indicate we're allowing a public key reset ...
            //       also that flag means we're doing a loginshield login even if the account
            //       doesn't yet have loginshield activated
            //       (because this login will cause it to be activated when successfully completed)
            this.$router.push({ path: '/login', query: { mode: 'activate-loginshield' } });
        },
    },

    created() {
        console.log('created'); // : isAuthenticated: %o', this.isAuthenticated);
    },

    mounted() {
        console.log('mounted');
        if (this.isReady) {
            this.init();
        }
    },
};
</script>
