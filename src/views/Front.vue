<template>
    <v-container class="py-10 px-2">
        <v-row justify="center"  class="py-5">
            <v-col style="text-align: center">
                 <h1 class="display-1 font-weight-light">Try LoginShield</h1>
            </v-col>
        </v-row>
        <v-row justify="center" class="py-5 pb-10">
            <v-col cols=2></v-col>
            <v-col>
                <v-row justify="center">
                    <p class="body-1 font-weight-light">
                        Create a new account <br/>(username &amp; password)
                    </p>
                </v-row>
            </v-col>
            <v-col>
                <v-row justify="center">
                    <p class="body-1 font-weight-light">
                        Enable LoginShield
                    </p>
                </v-row>

            </v-col>
            <v-col>
                <v-row justify="center">
                    <p class="body-1 font-weight-light">
                        Login with LoginShield
                    </p>
                </v-row>
            </v-col>
            <v-col cols=2></v-col>
        </v-row>
        <v-row justify="center">
            <v-col style="text-align: center">
                <v-btn tile elevation="12" class="green white--text" to="/register">Create a new account</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>

</style>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    components: {
    },
    computed: {
        ...mapState({
            isReady: state => state.isReady,
            session: state => state.session,
        }),
        ...mapGetters({
            currentAccount: 'account', // currently selected account object
        }),
        isAuthenticated() {
            return this.session.isAuthenticated;
        },
    },
    methods: {
        init() {
            if (this.isReady && this.isAuthenticated) {
                // this.$router.push('/dashboard');
            }
        },
    },
    watch: {
        isReady(value, oldValue) {
            if (value && !oldValue) {
                this.init();
            }
        },
    },
    mounted() {
        this.init();
    },
};
</script>
