<template>
    <v-container>
        <v-row justify="center">
            <v-col class="text-center">
                <h1 class="display-2 font-weight-light py-5">About Me</h1>
                <h2 class="headline font-weight-light mb-3">Your privacy is important to us.</h2>
                <h3 class="body-1 font-weight-light">On this page you can see the information we collect about you. You can choose to delete this information.</h3>
            </v-col>
        </v-row>

          <v-row justify="center">
            <v-col cols="12" sm="12" md="10" lg="8" xl="6" class="pa-0">
                <div v-if="localStorageData.length == 0">
                    <v-card tile elevation="6" class="grey lighten-5 pa-2">
                        <v-card-title primary-title class="text-uppercase justify-center text-center">
                            <span class="headline font-weight-light text-none">We have no information currently stored on your <b>device</b>.</span>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text class="pa-5" style="text-align: center">
                                This site uses a browser feature called "localStorage" to
                                store some information on your device when you use the service.
                                Return to this page after using the service with "localStorage"
                                enabled to see what we store.
                        </v-card-text>
                    </v-card>

                    <!-- local storage keys -->
                    <v-card tile elevation="6" class="grey lighten-5 pa-2 mt-5">
                        <v-card-title primary-title class="text-uppercase justify-center text-center">
                            <span class="title font-weight-light text-none">Your <b>browser</b> provides the following information:</span>
                        </v-card-title>
                        <v-divider/>
                        <v-list class="grey lighten-5" v-for="item in readonlyData"  v-bind:key="item.id">
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ item.value }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{item.label}}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                        <v-list class="grey lighten-5" v-for="item in cookieData" v-bind:key="item.id">
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ item.value }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{item.label}}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </div>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col cols="12" sm="12" md="10" lg="8" xl="6" class="pa-0">
                <!-- local storage items -->
                <div v-if="localStorageData.length > 0">
                    <v-card tile elevation="6" class="grey lighten-5 pa-2">
                        <v-card-title primary-title class="text-uppercase justify-center text-center">
                            <span class="title font-weight-light text-none">We store the following information on your <b>device</b>:</span>
                        </v-card-title>
                        <v-divider/>
                        <v-list class="grey lighten-5" v-for="item in localStorageData" v-bind:key="item.id">
                            <v-list-item enabled>
                                <v-list-item>
                                    <v-row>
                                        <v-list-item-title v-if="item.type == null || item.type == 'input'">
                                            {{ item.value }}
                                        </v-list-item-title>
                                        <v-list-item-subtitle>
                                            {{item.label}}
                                        </v-list-item-subtitle>
                                    <v-row>
                                    </v-row>
                                        <p class="caption" v-if="item.isGenerated">
                                        This information is generated automatically by LoginShield.
                                        Deleting this item may interfere with your ability to use the
                                        service.</p>
                                        <p class="caption" v-if="item.advice">{{item.advice}}</p>
                                    </v-row>
                                </v-list-item>
                            </v-list-item>
                        </v-list>
                    </v-card>

                    <v-row justify="center" class="py-5">
                        <v-btn tile elevation="6" v-on:click="reset" class="red white--text">Clear</v-btn>
                    </v-row>

                    <!-- local storage keys -->
                    <v-card tile elevation="6" class="grey lighten-5 pa-2 mt-10">
                        <v-card-title primary-title class="text-uppercase justify-center text-center">
                            <span class="title font-weight-light text-none">Your <b>browser</b> provides the following information:</span>
                        </v-card-title>
                        <v-divider/>
                        <v-list class="grey lighten-5" v-for="item in readonlyData"  v-bind:key="item.id">
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ item.value }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{item.label}}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                        <v-list class="grey lighten-5" v-for="item in cookieData" v-bind:key="item.id">
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ item.value }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{item.label}}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            // all known localStorage keys and descriptions
            localStorageDataInfo: [
                { id: 'name', label: 'Name', isInput: true },
                { id: 'email', label: 'Email', isInput: true },
                { id: 'phone', label: 'Phone', isInput: true },
                { id: 'isAgreeToTermsChecked', label: 'Is Agreed to Terms of Use', isInput: true },
                /*
                { id: 'isOptedIn', label: 'Opt-In Complete', isInput: false },
                {
                    id: 'optin', label: 'Opt-In ID', isInput: false, isGenerated: true,
                },
                */
                { id: 'agreeToTermsDate', label: 'Agreed to Terms of Use', isInput: false },
                { id: 'checkedAgreeToTermsDate', label: 'Agreed to Terms of Use (checked the box)', isInput: false },
                {
                    id: 'loginshield.client.token',
                    label: 'Client token',
                    isInput: false,
                    isPrivate: true,
                    isGenerated: true,
                },
                { id: 'isFirstTimeUser', label: 'First Time User', isInput: false },
                {
                    id: 'csrfGuardToken',
                    label: 'CSRF Guard Token',
                    isInput: false,
                    isPrivate: true,
                    isGenerated: true,
                },
            ],
            localStorageData: [],
            readonlyData: [
                { id: 'userAgent', label: 'User Agent', value: window.navigator.userAgent },
            ],
            cookieData: [
                /*
            { id: "loginshield", label: "LoginShield Session Cookie", value: "" }
            */
            ],
        };
    },
    created() {
    // index by key
        const localStorageInfoMap = {};
        let i;
        for (i = 0; i < this.localStorageDataInfo.length; i += 1) {
            localStorageInfoMap[this.localStorageDataInfo[i].id] = this.localStorageDataInfo[i];
        }
        // show only the ones that are present
        const localStorageKeys = Object.keys(window.localStorage);
        for (i = 0; i < localStorageKeys.length; i += 1) {
            const key = localStorageKeys[i];
            const stored = localStorage.getItem(key);
            let info = { id: key, label: key, isPrivate: false };
            if (typeof localStorageInfoMap[key] === 'object') {
                info = { ...localStorageInfoMap[key] };
            }
            if (info.isPrivate) {
                info.value = '(private)';
            } else if (stored === null || stored === '') {
                info.value = '(empty)';
            } else {
                info.value = stored;
            }
            this.localStorageData.push(info);
        }
    },
    methods: {
        reset() {
            this.localStorageData = [];
            this.cookieData = [];
            window.localStorage.clear();
            return false;
        },
    },
};
</script>
