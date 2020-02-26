<template>
    <v-container>
        <v-snackbar v-model="snackbarLoginshieldEnabled" :timeout="2000" top :color="loginshieldSnackbarColor" class="mt-0 pt-0">
            <span>{{ loginshieldSnackbarText }}</span>
            <v-btn text :class="loginshieldSnackbarClass" @click="snackbarLoginshieldEnabled = false"><font-awesome-icon icon="check" fixed-width/></v-btn>
        </v-snackbar>
        <v-row justify="center" class="py-5">
            <h1 class="display-1 font-weight-light">Account</h1>
        </v-row>
        <v-row justify="center" class="py-5">
            <v-col cols="12" sm="10" md="8" lg="6" xl="4" class="pa-0">
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
            <v-col cols="12" sm="10" md="8" lg="6" xl="4" class="pa-0">
                <v-card tile elevation="6" class="px-5 pb-3">

                        <v-card-text class="title text-center">
                        <span>Security</span>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <span class="pr-5" style="position: absolute; right: 0;" v-on="on">
                                    <font-awesome-icon icon="exclamation-triangle" class="orange--text" v-show="!isLoginshieldEnabled"/>
                                </span>
                            </template>
                            <span>Your account is not currently protected by LoginShield</span>
                        </v-tooltip>
                    </v-card-text>


                    <v-divider class="mx-5 mb-2"></v-divider>
                    <v-row justify="center" class="pt-5 px-5" v-if="!account.loginshield.isRegistered || !account.loginshield.isConfirmed">
                        <p>Click the button to setup LoginShield for this account:</p>
                    </v-row>
                    <v-row justify="center" class="pt-5 px-5 pb-3" v-if="!account.loginshield.isRegistered || !account.loginshield.isConfirmed">
                        <v-btn tile elevation="6" class="green white--text" @click="registerLoginShieldUser">
                            <font-awesome-icon icon="check" fixed-width/><span class="ml-2">Activate</span>
                        </v-btn>
                    </v-row>
                    <v-row justify="center" class="px-5 pb-3" v-if="account.loginshield.isRegistered && account.loginshield.isConfirmed">
                        <v-switch
                            v-model="isLoginshieldEnabled"
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
            isRegistrationError: false,
            snackbarLoginshieldEnabled: false,
            loginshieldSnackbarText: '',
            loginshieldSnackbarClass: '',
            loginshieldSnackbarColor: '',
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
            return { isRegistered: false, isConfirmed: false, isEnabled: false };
        },
        isLoginshieldEnabled: {
            get() {
                if (this.account) {
                    return this.account.loginshield.isEnabled;
                }
                return false;
            },
            async set(value) {
                const { isEdited } = await this.$store.dispatch('editAccount', { loginshield: { isEnabled: value } });
                if (isEdited) {
                    if (value) {
                        this.snackbarLoginshieldEnabled = true;
                        this.loginshieldSnackbarText = 'LoginShield Enabled';
                        this.loginshieldSnackbarClass = 'blue white--text';
                        this.loginshieldSnackbarColor = 'blue';
                    } else {
                        this.snackbarLoginshieldEnabled = true;
                        this.loginshieldSnackbarText = 'LoginShield Disabled';
                        this.loginshieldSnackbarClass = 'blue white--text';
                        this.loginshieldSnackbarColor = 'blue';
                    }
                } else {
                    console.log('Error editing account');
                }
            },
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
                // this.isLoginshieldEnabled = this.loginshield.isEnabled;
            } else {
                this.$router.push('/login');
            }
        },
        async registerLoginShieldUser() {
            this.isRegistrationError = false;
            if (!this.account.loginshield.isRegistered) {
                const response = await this.$store.dispatch('editAccount', { action: 'register-loginshield-user' });
                /* start redirect method */
                if (response.forward) {
                // redirect user to loginshield.com for registration (or to /account/loginshield/continue-registration if user already did the loginshield part but hasn't completed the first login here)
                    window.location = response.forward;
                    return;
                }
                /* end redirect method */
                console.log('registerLoginShieldUser response from editAccount: %o', response);
                if (!response.isEdited || response.error) {
                    this.isRegistrationError = true;
                    return;
                }
            }
            if (!this.account.loginshield.isConfirmed) {
                this.$router.push('/account/loginshield/continue-registration');
                return;
            }
            this.isLoginshieldEnabled = true;
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
