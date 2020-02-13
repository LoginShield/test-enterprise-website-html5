<template>
    <v-app>
        <Navbar app/>
        <v-content style="margin-top: 48px;" class="green lighten-5 py-10 px-3">
            <router-view></router-view>
        </v-content>
        <Footer/>
    </v-app>
</template>

<style>
  /* * {
    font-family: 'NunitoSans', sans-serif
  } */
</style>


<script>
// import '@/assets/font/NunitoSans/NunitoSans.css'
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

export default {
    name: 'App',

    components: {
        Navbar,
        Footer,
    },

    created() {
        console.log('app created, initializing');
        this.$store.dispatch('init');
    },
};
</script>
