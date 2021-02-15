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
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <span class="pr-5" style="position: absolute; right: 0;" v-on="on">
                                    <font-awesome-icon icon="exclamation-triangle" class="orange--text" v-show="isEnabledCheckComplete && !isLoginshieldEnabled"/>
                                </span>
                            </template>
                            <span>Action required</span>
                        </v-tooltip>
                    </v-card-text>
                    <v-divider class="mx-5 mb-5"></v-divider>
                    <v-row justify="center" class="px-5" v-if="isEnabledCheckComplete && !realmId">
                        <p class="font-weight-light text-center">
                            LoginShield is not yet configured.
                        </p>
                    </v-row>
                    <v-row justify="center" class="px-5" v-if="isEnabledCheckComplete && realmId">
                        <p class="font-weight-light text-center">
                            Realm ID: {{realmId}}
                        </p>
                    </v-row>
                    <v-row justify="center" class="px-5" v-if="isEnabledCheckComplete && !isLoginshieldEnabled">
                        <p class="font-weight-light text-center">
                            Continue to LoginShield to setup the enterprise account.
                        </p>
                    </v-row>
                    <!-- <v-row justify="center" class="px-5">
                        <p class="font-weight-light text-center">
                            Email: {{account.email}}
                        </p>
                    </v-row> -->
                    <v-row justify="center" class="pt-5 px-5 pb-3" v-if="isEnabledCheckComplete && !isLoginshieldEnabled">
                        <v-btn tile elevation="6" class="green white--text" @click="requestAdminAccess">
                            <span>Continue</span>
                        </v-btn>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </AppLayout>
</template>

<script>
import AppLayout from '@/components/AppLayout.vue';

export default {
    data() {
        return {
            isEnabledCheckComplete: false, // will be set to true after we check if LoginShield is enabled
            isLoginshieldEnabled: false,
            realmId: null,
            icon: null,
            error: null,
            webauthz: null, // the request URI
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
        async checkIsEnabled() {
            // check if LoginShield is enabled
            try {
                // if realm id is undefined, returns false; if realm id is defined, attempts a query to check if we have admin access
                const {
                    isEnabled, realmId, icon, error, webauthz,
                } = await this.$store.dispatch('checkIsEnabled');
                this.isLoginshieldEnabled = isEnabled;
                this.realmId = realmId;
                this.icon = icon;
                this.error = error;
                this.webauthz = webauthz;
            } catch (err) {
                console.error('checkIsEnabled failed', err);
            } finally {
                this.isEnabledCheckComplete = true;
            }
        },
        async requestAdminAccess() {
            if (this.webauthz) {
                window.location = this.webauthz;
            } else {
                console.error('requestAdminAccess failed, missing webauthz request uri');
            }
        },
    },

    mounted() {
        this.checkIsEnabled();
    },
};
</script>
