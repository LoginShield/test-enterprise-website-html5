import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faUser, faEnvelope, faPhone, faCheck, faFile,
    faCheckSquare, faPlus, faTrash, faSave, faCamera,
    faTimes, faSort, faSortDown, faCaretDown,
    faBriefcase, faCompress, faDesktop, faShieldAlt, faHeart, faUserSecret,
    faBuilding, faFingerprint, faCode, faBars, faUserCircle,
    faPencilAlt, faSearch, faEdit, faInfoCircle,
    faCloudDownloadAlt, faUnlock,
    faAngleRight, faAngleLeft, faAngleDoubleRight, faAngleDoubleLeft,
    faMinusSquare, faPaperclip, faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import {
    faSquare,
} from '@fortawesome/free-regular-svg-icons';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

Vue.use(Vuetify);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);
Vue.component('font-awesome-layers-text', FontAwesomeLayersText);

library.add(faUser, faEnvelope, faPhone, faCheck, faFile, faCheckSquare, faSquare,
    faPlus, faTrash, faSave, faCamera, faBriefcase, faCompress, faDesktop, faShieldAlt,
    faTimes, faSort, faSortDown, faCaretDown,
    faHeart, faBuilding, faUserSecret, faFingerprint, faCode, faBars, faUserCircle,
    faPencilAlt, faSearch, faEdit, faInfoCircle,
    faCloudDownloadAlt, faUnlock,
    faAngleRight, faAngleLeft, faAngleDoubleRight, faAngleDoubleLeft,
    faMinusSquare, faPaperclip, faExclamationTriangle);

Vue.config.productionTip = false;

/*
Example input:
{
    first: ['fas', 'angle-double-left'],
    prev: ['fas', 'angle-left'],
}
Example output:
{
    first: {
        component: FontAwesomeIcon,
        props: {
            icon: ['fas', 'angle-double-left'],
        },
    },
    prev: {
        component: FontAwesomeIcon,
        props: {
            icon: ['fas', 'angle-left'],
        },
    },
}
*/
function mapFontAwesomeIcons(iconMap) {
    const output = {};
    Object.entries(iconMap).forEach(([key, value]) => {
        output[key] = {
            component: FontAwesomeIcon,
            props: {
                icon: value,
            },
        };
    });
    return output;
}

new Vue({
    router,
    store,
    vuetify: new Vuetify({
        options: {
            customProperties: true,
        },
        // https://vuetifyjs.com/en/getting-started/quick-start#font-installation
        icons: {
            iconfont: 'faSvg', // https://vuetifyjs.com/en/customization/icons#install-font-awesome-svg-icons
            /* non-svg icons can use the simple values:
            values: {
                first: 'fas fa-angle-double-left',
                prev: 'fas fa-angle-left',
                last: 'fas fa-angle-double-right',
                next: 'fas fa-angle-right',
                sort: 'fas fa-sort',
                dropdown: 'fas fa-caret-down',
            },
            */
            // svg icons must be rendered by the FontAwesomeIcon component (https://vuetifyjs.com/en/customization/icons#custom-font-awesome-pro-icons)
            // to use a custom icon somewhere, add it to this list like newIcon: ['fas', 'new-icon'] and then
            // reference it in the component like  customIcon: '$vuetify.icons.newIcon'
            values: {
                ...mapFontAwesomeIcons({
                    first: ['fas', 'angle-double-left'],
                    prev: ['fas', 'angle-left'],
                    next: ['fas', 'angle-right'],
                    last: ['fas', 'angle-double-right'],
                    checkboxOn: ['fas', 'check-square'],
                    checkboxOff: ['far', 'square'],
                    checkboxIndeterminate: ['fas', 'minus-square'],
                    file: ['fas', 'paperclip'],
                    clear: ['fas', 'times'],
                    expand: ['fas', 'caret-down'],
                    /*
                    caret-down is centered, so works nicely with v-data-table where it
                    flips the icon depending on the sort direction, whereas the
                    sort-down icon is aligned bottom so appears to move up and down when
                    being flipped by v-data-table
                    */
                    sort: ['fas', 'caret-down'],
                    dropdown: ['fas', 'caret-down'],
                }),
            },
        },
    }),
    render: h => h(App),
}).$mount('#app');
