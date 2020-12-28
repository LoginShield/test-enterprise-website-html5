/*
Copyright (C) 2019 Cryptium Corporation. All rights reserved.
*/
/* eslint-disable no-console, class-methods-use-this, max-classes-per-file */

const ajax = require('axios');

function withEndpoint(path) {
    const endpoint = process.env.VUE_APP_SERVICE_ENDPOINT_URL || '/service';
    console.log(`client.js: endpoint ${endpoint}`);
    let relativePath = path;
    if (path.startsWith('/')) {
        relativePath = path.substr(1);
    }
    const result = `${endpoint}/${relativePath}`;
    console.log(`client request to: ${result}`);
    return result;
}

async function getJson(path, query) {
    try {
        const response = await ajax.get(withEndpoint(path), {
            headers: {
                Accept: 'application/json',
            },
            params: query,
        });
        if (response.data) {
            return response.data;
        }
        return { error: 'unexpected response from server', response };
    } catch (error) {
        if (error.response.data && error.response.data.error) {
            return error.response.data;
        }
        return { error: 'unexpected response from server', response: error.response };
    }
}

async function postJsonAcceptJson(path, request, query) {
    try {
        const response = await ajax.post(withEndpoint(path), request ? JSON.stringify(request) : null, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            params: query,
        });
        if (response.data) {
            return response.data;
        }
        return { error: 'unexpected response from server', response };
    } catch (error) {
        if (error.response.data && error.response.data.error) {
            return error.response.data;
        }
        return { error: 'unexpected response from server', response: error.response };
    }
}

class Service {
    async getContext() {
        return getJson('/context');
    }

    async getVersion() {
        return getJson('/version');
    }
}

class Session {
    async get() {
        return getJson('/session');
    }

    async login(request) {
        return postJsonAcceptJson('/session/login', request);
    }

    async loginWithPassword(request) {
        return postJsonAcceptJson('/session/login/password', request);
    }

    async loginWithLoginShield(request) {
        return postJsonAcceptJson('/session/login/loginshield', request);
    }

    async logout(request = {}) {
        return postJsonAcceptJson('/session/logout', request);
    }
}

class Account {
    async create(request) {
        return postJsonAcceptJson('/account/create', request);
    }

    async get() {
        return getJson('/account');
    }

    async edit(request) {
        // NOTE: you only need to specify the attributes that should be changed
        return postJsonAcceptJson('/account/edit', request);
    }
}

class Client {
    constructor() {
        this.service = new Service();
        this.session = new Session();
        this.account = new Account();
    }
}

export { Client };
