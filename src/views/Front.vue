<template>
    <v-container>
        <v-row justify="center"  class="py-5">
            <v-col>
                <v-row justify="center">
                    <h1 class="display-2 font-weight-light text-center">Try the demo</h1>
                </v-row>
            </v-col>
        </v-row>
        <v-row justify="center" class="pt-5 pb-10">
            <v-col cols="4" sm="4" md="3" lg="3" xl="2">
                <v-row justify="center">
                    <p class="display-2">1</p>
                </v-row>
                <v-row justify="center" class="pt-3">
                    <p class="headline font-weight-light text-center">Create account</p>
                </v-row>
            </v-col>
            <v-col cols="4" sm="4" md="3" lg="3" xl="2">
                <v-row justify="center">
                    <p class="display-2">2</p>
                </v-row>
                <v-row justify="center" class="pt-3">
                    <p class="headline font-weight-light text-center">
                        Enable LoginShield
                    </p>
                </v-row>
            </v-col>
            <v-col cols="4" sm="4" md="3" lg="3" xl="2">
                <v-row justify="center">
                    <p class="display-2">3</p>
                </v-row>
                <v-row justify="center" class="pt-3">
                    <p class="headline font-weight-light text-center">
                        Login with LoginShield
                    </p>
                </v-row>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-btn tile elevation="24" class="green white--text" to="/create">Create account</v-btn>
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
