<template>
    <v-container class="py-10 px-2">
        <v-row justify="center" class="py-5">
            <h1 class="display-1 font-weight-light">Login</h1>
        </v-row>
        <v-row justify="center" class="py-5">
            <v-col cols="12" sm="10" md="8" lg="6" xl="4">
                <v-card tile elevation="6" class="px-10 pb-5 pt-10" v-if="loginUsernameInput">
                    <v-form v-model="loginUsernameForm">
                    <v-text-field
                        v-model=username
                        label="Username"
                        :rules="usernameRules"
                    ></v-text-field>
                    <v-card-actions>
                        <v-row justify="center">
                            <v-btn tile elevation="6" class="blue white--text" @click="loginUsername" :disabled="!loginUsernameForm">
                                <font-awesome-icon icon="check" fixed-width/>&nbsp;Next
                            </v-btn>
                        </v-row>
                    </v-card-actions>
                    </v-form>
                </v-card>
                <v-card tile elevation="6" class="px-10 pb-5 pt-10" v-if="loginPasswordInput">
                    <v-form v-model="loginPasswordForm">
                    <v-text-field
                        v-model=password
                        label="Password"
                        :rules="passwordRules"
                        type="password"
                    ></v-text-field>
                    <v-card-actions>
                        <v-row justify="center">
                            <v-btn tile elevation="6" class="blue white--text" @click="loginPassword" :disabled="!loginPasswordForm">
                                <font-awesome-icon icon="check" fixed-width/>&nbsp;Login
                            </v-btn>
                        </v-row>
                    </v-card-actions>
                    </v-form>
                </v-card>
                <v-card tile elevation="6" class="px-10 pb-5 pt-10" v-show="loginWithLoginShield">
                    <!-- TODO: the qr code or push notification UI goes here -->
                    <h1>Login with LoginShield</h1>
                    <div id="loginshield-content"></div>
                </v-card>
            </v-col>
        </v-row>
        <v-row justify="center" class="py-5" v-if="error">
            <p class="body-1 font-weight-light">Incorrect username or password</p>
        </v-row>

    </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { loginshieldInit } from '@loginshield/enterprise-client-browser';
import { isValidName, compact } from '@/sdk/input';

export default {
    data() {
        return {
            loginUsernameInput: true,
            loginPasswordInput: false,
            loginWithLoginShield: false,
            loginUsernameForm: null,
            loginPasswordForm: null,
            username: null,
            password: null,
            usernameRules: [
                v => !!v || 'Username is required',
                v => !v || isValidName(compact(v)) || 'Username is required',
            ],
            passwordRules: [
                v => !!v || 'Password is required',
                v => !v || isValidName(compact(v)) || 'Password is required',
            ],
            error: false,
        };
    },

    watch: {
        isReady(value, oldValue) {
            if (value && !oldValue) {
                this.init();
            }
        },
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
    },

    methods: {
        init() {
            if (this.$route.query.mode === 'resume-loginshield' && this.$route.query.loginshield) {
                // if the client arrives with this query parameter it
                // indicates a loginshield authentication in progress
                console.log('login: resume loginshield authentication mode');
                this.loginUsernameInput = false;
                this.loginWithLoginShield = true;
                this.resumeLoginShield({ resume: this.$route.query.loginshield });
                return;
            }
            if (this.isAuthenticated) {
                if (this.$route.query.mode === 'activate-loginshield') {
                    // we might get here from account page to activate loginshield
                    console.log('login: activate loginshield mode');
                    this.loginUsernameInput = false;
                    this.loginWithLoginShield = true;
                    console.log(`username: ${this.account.username}`);
                    this.startLoginShield({ mode: 'activate-loginshield', username: this.account.username });
                } else {
                    // in all other cases, if user already authenticated redirect to account page:
                    this.$router.push('/account');
                }
            }
        },
        async loginUsername() {
            this.error = false;
            const { mechanism } = await this.$store.dispatch('login', {
                username: this.username,
            });
            if (mechanism === 'password') {
                this.loginUsernameInput = false;
                this.loginPasswordInput = true;
            } else if (mechanism === 'loginshield') {
                this.loginUsernameInput = false;
                this.loginWithLoginShield = true;
                this.startLoginShield({ username: this.username });
            } else {
                this.error = true;
            }
        },
        async loginPassword() {
            this.error = false;
            const { isAuthenticated, error } = await this.$store.dispatch('loginWithPassword', {
                username: this.username,
                password: this.password,
            });
            if (isAuthenticated) {
                this.$router.push('/account');
            } else {
                if (error) {
                    console.error(`loginPassword error: ${error}`);
                }
                this.error = true;
            }
        },
        async startLoginShield({ mode, username }) {
            this.error = false;

            const { /* draft 1: challenge, */ error, forward } = await this.$store.dispatch('loginWithLoginShield', {
                username,
                mode,
            });
            if (forward) {
                // redirect to loginshield for login
                // this works, it's the redirect method: window.location = forward;
                loginshieldInit({
                    elementId: 'loginshield-content',
                    forward,
                    onLogin: ((verifyInfo) => {
                        this.finishLoginShield(verifyInfo);
                        /* draft 1:
                        console.log(`login.vue: login successful, forward url: ${redirect}`);
                        window.location = redirect; // the redirect url provided by the enterprise service to loginshield, plus the loginshield token in the query parameters
                        */
                    }),
                    onError: ((err) => {
                        console.log('startLoginShield: login failed, error: %o', err);
                        this.error = true;
                    }),
                });
            } else {
                // TODO: show a more specific error message that the account either doesn't exist or
                // doesn't have loginshield enabled, or isn't ready to activate loginshield
                if (error) {
                    console.error(`startLoginShield error: ${error}`);
                }
                this.error = true;
                this.loginUsernameInput = true;
                this.loginWithLoginShield = false;
            }
            /* draft 1:
            else if (challenge) {
                loginshieldInit({
                    elementId: 'loginshield-content',
                    challenge,
                    onLogin: ((redirect) => {
                        console.log(`login.vue: login successful, forward url: ${redirect}`);
                        // TODO: window.location = redirect;  ... what is the forward url ?  is it to loginshield.com or to the enterprise domain ????
                    }),
                    onError: ((err) => {
                        console.log('login.vue: login failed, error: %o', err);
                        this.error = true;
                    }),
                });
            } */
        },
        async resumeLoginShield({ /* mode, */ resume }) {
            this.error = false;
            loginshieldInit({
                elementId: 'loginshield-content',
                resume,
                onLogin: ((verifyInfo) => {
                    this.finishLoginShield(verifyInfo);
                }),
                onError: ((err) => {
                    console.log('resumeLoginShield: login failed, error: %o', err);
                    this.error = true;
                }),
            });
        },
        async finishLoginShield({ verifyToken }) {
            console.log(`finishLoginShield: verifying login with token: ${verifyToken}`);
            const { isAuthenticated, error } = await this.$store.dispatch('loginWithLoginShield', {
                // mode: 'verify-loginshield',  mode is not even needed, if we send the token the service knows to use it to verify the login ;
                verifyToken,
            });
            if (isAuthenticated) {
                this.$router.push('/account');
            } else if (error) {
                console.error(`finishLoginShield error: ${error}`);
                this.error = true;
            } else {
                // TODO: show a loginshield specific error and then try loginshield login again,
                // because this situation could happen when a phishing attack is circumvented,
                // and the second login would succeed; in this case the call returns
                // isAuthenticated: false, but no error, because the processing is routine
            }
        },
    },

    mounted() {
        console.log('Login.vue: mounted with isReady: %o and isAuthenticated: %o', this.isReady, this.isAuthenticated);
        if (this.isReady) {
            this.init();
        }
    },
};
</script>
