<template>
    <v-avatar :size=size>
        <v-gravatar v-if="useGravatar" :email=attr.email :size=size></v-gravatar>
        <span :style="{'font-size': (size-12)+'px'}"><font-awesome-icon v-if="useDefaultIcon" icon="user-circle" fixed-width size="1x"></font-awesome-icon></span>
    </v-avatar>
</template>

<script>
import gravatar from 'vue-gravatar';

export default {

    props: {
        attr: {
            type: Object,
            default() {
                return {
                    icon: '', // base64 icon data
                    isGravatarEnabled: false, // for gravatar (requires email)
                    email: '', // for gravatar (requires isGravatarEnabled)
                };
            },
        },
        size: {
            // type: Number,
            default: '80',
        },
    },

    components: {
        'v-gravatar': gravatar,
    },

    computed: {
        useGravatar() {
            // only if gravatar enabled and there's a profile email to use
            if (this.attr.isGravatarEnabled && this.attr.email) {
                return true;
            }
            return false;
        },
        useDefaultIcon() {
            // not if useGravatar
            if (this.attr.isGravatarEnabled && this.attr.email) {
                return false;
            }
            // default
            return true;
        },
        sizePx() {
            return `${this.size}px`;
        },
    },

};
</script>
