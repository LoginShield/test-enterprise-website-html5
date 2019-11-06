<template>
    <v-container class="pa-0">
        <v-row justify="center"  class="py-5">
            <v-col style="text-align: center">
                 <h1 class="display-2 font-weight-light">Enterprise integration</h1>
            </v-col>
        </v-row>
        <v-row justify="center" class="py-5 pb-10">
            <v-col class="justify" >
                 <ol>
                     <li>Create a new account (username &amp; password)</li>
                     <li>Enable LoginShield</li>
                     <li>Login with LoginShield</li>
                 </ol>
            </v-col>
        </v-row>
        <v-divider class="mt-5"></v-divider>
        <v-row justify="center" class="py-5 pb-10">
            <v-col style="text-align: center">
                <v-btn tile elevation="12" class="blue white--text" to="/register">Create a new account</v-btn>
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
