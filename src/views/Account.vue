<template>
    <v-container class="py-10 px-2">
        <v-row justify="center" class="py-5">
            <h1 class="display-1 font-weight-light">Account</h1>
        </v-row>
        <v-row justify="center" class="py-5">
            <v-col cols="12" sm="10" md="8" lg="6" xl="4">
                <v-card tile elevation="6" class="px-5 pb-3">
                    <v-card-text class="title text-center">Profile</v-card-text>
                    <v-divider class="mx-5 mb-5"></v-divider>
                    <v-row justify="center" class="px-5">
                        <p class="font-weight-light text-center">
                            Username: {{account.username}}
                        </p>
                    </v-row>
                    <v-row justify="center" class="px-5">
                        <p class="font-weight-light text-center">
                            Email: {{account.email}}
                        </p>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row justify="center" class="py-5">
            <v-col cols="12" sm="10" md="8" lg="6" xl="4">
                <v-card tile elevation="6" class="px-5 pb-3">
                    <v-card-text class="title text-center">Security</v-card-text>
                    <v-divider class="mx-5 mb-2"></v-divider>
                    <v-row justify="center" class="pt-5 px-5" v-if="!account.loginshield.isRegistered">
                        <p>Click the button to setup LoginShield for this account:</p>
                    </v-row>
                    <v-row justify="center" class="pt-5 px-5 pb-3" v-if="!account.loginshield.isRegistered">
                        <v-btn tile elevation="6" class="blue white--text" @click="registerLoginShieldUser">
                            <font-awesome-icon icon="check" fixed-width/>&nbsp;Register
                        </v-btn>
                    </v-row>
                    <v-row justify="center" class="px-5 pb-3" v-if="account.loginshield.isRegistered">
                        <v-switch
                            v-model="editableLoginShieldIsEnabled"
                            color="blue"
                            hide-details
                        >
                        <template v-slot:label>
                            <span style="margin-left: 4px">Protect this account with LoginShield</span>
                        </template>
                        </v-switch>
                    </v-row>
                    <v-row justify="center" class="pt-3 px-5 pb-3" v-if="isRegistrationError">
                        <p>Registration error</p>
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
            editableLoginShieldIsEnabled: null,
            isRegistrationError: false,
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
        /*
        loginshieldSwitch: {
            get() {
                if (this.currentAccount) {
                    return this.currentAccount.isGravatarEnabled;
                }

                return false;
            },
            set(value) {
                this.$store.dispatch('editAccount', { id: this.currentAccount.id, isGravatarEnabled: value });
            },
        },
        */
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
            if (this.isAuthenticated) {
                this.editableLoginShieldIsEnabled = this.loginshield.isEnabled;
            } else {
                this.$router.push('/login');
            }
        },
        async registerLoginShieldUser() {
            this.isRegistrationError = false;
            const response = await this.$store.dispatch('editAccount', { action: 'register-loginshield-user' });
            if (response.forward) {
                // redirect user to loginshield.com for registration (or to /account/loginshield/continue-registration if user already did the loginshield part but hasn't completed the first login here)
                window.location = response.forward;
            }
            if (response.error) {
                this.isRegistrationError = true;
            }
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
