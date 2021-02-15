<template>
    <AppLayout>
        <v-snackbar v-model="snackbarEnabled" :timeout="2000" top :color="snackbarColor" class="mt-0 pt-0">
            <span>{{ snackbarText }}</span>
            <v-btn text :class="snackbarClass" @click="snackbarEnabled = false"><font-awesome-icon icon="check" fixed-width/></v-btn>
        </v-snackbar>
        <v-row justify="center" class="py-5">
            <h1 class="display-1 font-weight-light">Administration</h1>
        </v-row>
        <v-row justify="center" class="py-5">
            <v-col cols="12" sm="10" md="8" lg="6" xl="4" class="pa-0">
                <v-card tile elevation="6" class="px-5 pb-3">
                    <v-card-text class="title text-center">
                        <span>LoginShield Setup</span>
                    </v-card-text>
                    <v-divider class="mx-5 mb-15"></v-divider>
                    <v-row justify="center" class="px-5 pb-10" v-if="!isReady">
                        <p class="font-weight-light text-center">
                            Processing...
                        </p>
                    </v-row>
                    <v-row justify="center" class="px-5 py-5" v-if="isGranted">
                        <v-alert dense type="success" border="left">
                            <template v-slot:prepend>
                                <font-awesome-icon fixed-width icon="check" class="white--text headline"/>
                            </template>
                            <span class="ml-2 headline">The access request was granted</span>
                        </v-alert>
                    </v-row>
                    <v-row justify="center" class="px-5 py-5" v-if="isDenied">
                        <v-alert dense type="info" border="left">
                            <template v-slot:prepend>
                                <font-awesome-icon fixed-width icon="info-circle" class="white--text headline"/>
                            </template>
                            <span class="ml-2 headline">The access request was denied</span>
                        </v-alert>
                    </v-row>
                    <v-row justify="center" class="px-5 py-5" v-if="isBadRequest">
                        <v-alert dense type="error" border="left">
                            <template v-slot:prepend>
                                <font-awesome-icon fixed-width icon="exclamation-triangle" class="white--text headline"/>
                            </template>
                            <span class="ml-2 headline">We cannot process this request</span>
                        </v-alert>
                    </v-row>

                    <v-row justify="center" class="py-5 px-5" v-if="isReady">
                        <router-link to="/admin">Return to LoginShield setup</router-link>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </AppLayout>
</template>

<script>
import AppLayout from '@/components/AppLayout.vue';
import { Client } from '@/client';

const client = new Client();

export default {
    data() {
        return {
            isReady: false,
            isBadRequest: false,
            isDenied: false,
            isGranted: false,
            error: null,
            snackbarEnabled: false,
            snackbarText: '',
            snackbarClass: '',
            snackbarColor: '',
        };
    },
    components: {
        AppLayout,
    },

    methods: {
        snackbarInfo(text) {
            this.snackbarEnabled = true;
            this.snackbarText = text;
            this.snackbarClass = 'blue white--text';
            this.snackbarColor = 'blue';
        },
        snackbarError(text) {
            this.snackbarEnabled = true;
            this.snackbarText = text;
            this.snackbarClass = 'red white--text';
            this.snackbarColor = 'red';
        },
        async checkWebauthzGrant() {
            try {
                /* eslint-disable camelcase */
                this.isReady = false;
                const {
                    client_id,
                    client_state,
                    status,
                    grant_token,
                } = this.$route.query;

                console.error(`checkWebauthzGrant: client_id ${client_id} client_state ${client_state} status ${status} grant_token ${grant_token}`);
                if (!client_id || !client_state) {
                    this.error = true;
                    this.isBadRequest = true;
                    return;
                }

                this.isDenied = status === 'denied' || !grant_token;
                this.isGranted = !!grant_token;

                await client.service.finishWebauthzRequest({
                    client_id,
                    client_state,
                    status,
                    grant_token,
                });

                this.$router.push({ path: '/admin' });
                /* eslint-enable camelcase */
            } catch (err) {
                console.error('checkIsEnabled failed', err);
                this.isBadRequest = true;
            } finally {
                this.isReady = true;
            }
        },
    },

    mounted() {
        this.checkWebauthzGrant();
    },
};
</script>
