<template>
    <v-container>
        <v-row justify="center" class="py-5">
            <h1 class="display-1 font-weight-light">Create new account</h1>
        </v-row>
        <v-row justify="center" class="py-5">
            <v-col cols="12" sm="10" md="8" lg="6" xl="4" class="pa-0">
                <v-card tile elevation="6" class="px-10 py-5">
                    <v-form v-model="createAccountForm" ref="createAccountFormRef" @submit="validateCreateAccount" onSubmit="return false;" @keyup.enter.native="validateCreateAccount">
                        <v-text-field
                            outlined
                            color="green"
                            v-model=username
                            label="Username"
                            :rules="usernameRules"
                            autofocus
                        ></v-text-field>
                        <v-text-field
                            outlined
                            color="green"
                            v-model=email
                            label="Email"
                            :rules="emailRules"
                        ></v-text-field>
                        <v-text-field
                            outlined
                            color="green"
                            v-model=password
                            label="Password"
                            :rules="passwordRules"
                            type="password"
                        ></v-text-field>
                        <v-row justify="center" v-if="error">
                            <p class="body-1 font-weight-light red--text">Account creation failed</p>
                        </v-row>
                        <v-row justify="center">
                            <v-card-actions>
                                <v-btn tile elevation="6" class="green white--text" @click="createAccount" :disabled="!createAccountForm">
                                    <font-awesome-icon icon="check" fixed-width/>&nbsp;Create
                                </v-btn>
                            </v-card-actions>
                        </v-row>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { isValidName, isValidEmail, compact } from '@/sdk/input';

export default {
    data() {
        return {
            createAccountForm: null,
            username: null,
            password: null,
            email: null,
            usernameRules: [
                v => !!v || 'Username is required',
                v => !v || isValidName(compact(v)) || 'Username is required',
            ],
            emailRules: [
                v => !!v || 'Email address is required',
                v => !v || isValidEmail(v) || 'Email address is required',
            ],
            passwordRules: [
                v => !!v || 'Password is required',
                v => !v || isValidName(compact(v)) || 'Password is required',
            ],
            error: false,
        };
    },

    computed: {
        ...mapState({
            isReady: state => state.isReady,
        }),
        ...mapGetters({
            isAuthenticated: 'isAuthenticated',
        }),
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
                this.$router.push('/account');
            }
        },
        async createAccount() {
            this.error = false;
            console.log('createAccount');
            const request = {
                username: this.username,
                email: this.email,
                password: this.password,
            };
            const response = await this.$store.dispatch('createAccount', request);
            console.log('createAccount response: %o', response);
            if (response.isCreated) {
                this.$router.push('/account');
            } else {
                this.error = true;
            }
        },
        validateCreateAccount() {
            if (this.$refs.createAccountFormRef.validate()) {
                this.createAccount();
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
