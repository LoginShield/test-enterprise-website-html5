<template>
    <nav>
        <v-app-bar fixed fade-on-scroll elevation="4" height="48" app color="grey lighten-4">
            <router-link to="/" style="text-decoration: none" v-if="!isAuthenticated">
                <v-toolbar-title class="green--text overline" style="font-size: 16px!important;">
                    LoginShield Demo
                </v-toolbar-title>
            </router-link>
            <router-link to="/account" style="text-decoration: none" v-if="isAuthenticated">
                <v-toolbar-title class="green--text overline" style="font-size: 16px!important;">
                    LoginShield Demo
                </v-toolbar-title>
            </router-link>
            <v-progress-linear
                :active="isLoading"
                :indeterminate="isLoading"
                absolute
                bottom
                color="green"
            ></v-progress-linear>
            <v-spacer></v-spacer>
            <div v-if="!isAuthenticated">
                <div v-show="$vuetify.breakpoint.smAndUp">
                    <v-tabs slider-color="green" right color="green" background-color="grey lighten-4">
                        <v-tab to="/" v-show="false"></v-tab>
                        <!-- <v-tab to="/software">Software</v-tab> -->
                        <v-tab to="/admin">Admin</v-tab>
                        <v-tab to="/login">Login</v-tab>
                    </v-tabs>
                </div>
                <div v-show="$vuetify.breakpoint.xsOnly">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn text v-on="on">
                                <font-awesome-icon right class="green--text" icon="bars" fixed-width/>
                            </v-btn>
                        </template>
                        <v-tabs vertical slider-color="green" color="green" background-color="grey lighten-4">
                            <v-tab to="/" v-show="false"></v-tab>
                            <!-- <v-tab class="ml-0" to="/software">Software</v-tab> -->
                            <v-tab to="/admin">Admin</v-tab>
                            <v-tab to="/login">Login</v-tab>
                        </v-tabs >
                    </v-menu>
                </div>
            </div>
            <div v-if="isAuthenticated">
                <v-tabs slider-color="green" color="green">
                    <!-- Show toolbar buttons on large screens -->
                    <v-tab to="/account" v-show="false"></v-tab>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-tab v-on="on">
                                <Avatar :attr="account" size="36"/>
                            </v-tab>
                        </template>
                        <v-list class="ma-0 pa-0">
                            <v-list-item to="/account" class="lighten-5 green" style="padding-left: 8px;">
                                <v-list-item-avatar style="margin-right: 8px;">
                                    <Avatar :attr="account" size="32"/>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>{{ account.username }}</v-list-item-title>
                                    <v-list-item-subtitle class="overline" style="margin-left: 2px">{{ account.email }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                            <v-divider></v-divider>
                            <div>
                                <v-tabs vertical slider-color="green" class="menutabs" color="green">
                                    <v-tab to="/account" v-show="false"></v-tab>
                                    <v-divider></v-divider>
                                    <v-tab @click="logout">Logout</v-tab>
                                </v-tabs>
                            </div>
                        </v-list>
                    </v-menu>
                </v-tabs>
            </div>
        </v-app-bar>
    </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Avatar from '@/components/Avatar.vue';

// this.$store.commit('isLoading', true);
// this.$route.name   ->   so we can change menu items based on current route (current page)
// current route names:  front, about, privacy, software, terms, login, locked, me, device, select-profile, profile, test

export default {
    components: {
        Avatar,
    },
    methods: {
        async logout() {
            console.log('logout: redirecting to front page');
            await this.$store.dispatch('logout');
            if (this.$route.name !== 'front') {
                this.$router.push('/');
            }
        },
    },

    computed: {
        ...mapState({
            isAuthenticated: (state) => state.session.isAuthenticated,
            account: (state) => state.account,
        }),
        ...mapGetters({
            isLoading: 'isLoading',
        }),
    },
};
</script>

<style>
    div.menutabs div[role="tablist"] { width: 100%; }
    div.menutabs [role="tab"] { justify-content: flex-start; padding-left: 48px;}
</style>
