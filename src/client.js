
/*
Copyright (C) 2019 Cryptium Corporation. All rights reserved.
*/
/* eslint-disable no-console, class-methods-use-this */

const ajax = require('axios');

async function getJson(path) {
    const response = await ajax.get(path, {
        headers: {
            Accept: 'application/json',
        },
    });
    return response.data;
}

async function postJsonAcceptJson(path, request) {
    const response = await ajax.post(path, JSON.stringify(request), {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
    return response.data;
}


class Service {
    async getContext() {
        return getJson('/service/context');
    }

    async getVersion() {
        return getJson('/service/version');
    }
}

class Session {
    async get() {
        return getJson('/service/session');
    }

    async login(request) {
        return postJsonAcceptJson('/service/session/login', request);
    }

    async loginWithPassword(request) {
        return postJsonAcceptJson('/service/session/login/password', request);
    }

    async loginWithLoginShield(request) {
        return postJsonAcceptJson('/service/session/login/loginshield', request);
    }

    async logout(request = {}) {
        return postJsonAcceptJson('/service/session/logout', request);
    }
}


class Account {
    async create(request) {
        return postJsonAcceptJson('/service/account/create', request);
    }

    async get() {
        return getJson('/service/account');
    }

    async edit(request) {
        // NOTE: you only need to specify the attributes that should be changed
        return postJsonAcceptJson('/service/account/edit', request);
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
