<template>
    <v-container class="py-10 px-2">
        <v-row justify="center" class="py-5">
            <h1 class="display-1 font-weight-light">Login</h1>
        </v-row>
        <v-row justify="center" class="py-5">
            <v-col cols="12" sm="10" md="8" lg="6" xl="4">
                <v-card tile elevation="6" class="px-10 pb-5 pt-10">
                    <v-form v-model="loginForm">
                    <v-text-field
                        v-model=username
                        label="Username"
                        :rules="usernameRules"
                    ></v-text-field>
                    <v-text-field
                        v-model=password
                        label="Password"
                        :rules="passwordRules"
                        type="password"
                    ></v-text-field>
                    <v-card-actions>
                        <v-row justify="center">
                            <v-btn tile elevation="6" class="blue white--text" @click="login" :disabled="!loginForm">
                                <font-awesome-icon icon="check" fixed-width/>&nbsp;Login
                            </v-btn>
                        </v-row>
                    </v-card-actions>
                    </v-form>
                </v-card>
            </v-col>
            <v-row justify="center" class="py-5" v-if="error">
                <p class="body-1 font-weight-light">Incorrect username or password</p>
            </v-row>
        </v-row>

    </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { isValidName, compact } from '@/sdk/input';

export default {
    data() {
        return {
            loginForm: null,
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
        }),
        ...mapGetters({
            isAuthenticated: 'isAuthenticated',
        }),
    },

    methods: {
        init() {
            if (this.isAuthenticated) {
                this.$router.push('/account');
            }
        },
        async login() {
            this.error = false;
            const { isAuthenticated } = await this.$store.dispatch('login', {
                username: this.username,
                password: this.password,
            });
            if (isAuthenticated) {
                this.$router.push('/account');
            } else {
                this.error = true;
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
