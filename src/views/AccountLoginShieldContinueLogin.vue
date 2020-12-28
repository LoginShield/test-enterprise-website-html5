<template>
    <AppLayout>
        <v-row justify="center" class="py-5">
            <h1 class="display-1 font-weight-light">Account</h1>
        </v-row>
        <v-row justify="center" class="py-5">
            <v-col cols="12" sm="10" md="8" lg="6" xl="4" class="pa-0">
                <v-row justify="center" class="pt-5 px-2">
                    <p class="title text-center">Validating login...</p>
                </v-row>
                <v-row justify="center" class="pt-5 px-2" v-show="error">
                    <p class="title text-center">Login failed</p>
                    <a href="/login">Try again</a>
                </v-row>
            </v-col>
        </v-row>
    </AppLayout>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import AppLayout from '@/components/AppLayout.vue';

export default {
    data() {
        return {
            error: false,
        };
    },
    components: {
        AppLayout,
    },
    computed: {
        ...mapState({
            isReady: (state) => state.isReady,
            session: (state) => state.session,
            account: (state) => state.account,
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
            console.log('init');
        },
    },

    async created() {
        console.log('created');
        const QUERY = this.$route.query;
        if (QUERY.loginshield) {
            console.log('got loginshield: %s', QUERY.loginshield);
            const token = QUERY.loginshield;
            const { isAuthenticated, error } = await this.$store.dispatch('loginWithLoginShield', {
                verifyToken: token,
            });
            if (isAuthenticated) {
                this.$router.push('/account');
            }
            if (error) {
                this.error = true;
            }
        }
    },

    mounted() {
        console.log('mounted');
        if (this.isReady) {
            this.init();
        }
    },
};
</script>
