test-enterprise-website-html5
=============================

To run the test service locally, you'll need to:

1. Follow directions in [Developer setup](#developer-setup)
2. Set the [Environment variables](#environment-variables)
3. Follow directions in [Start](#start) for this service

In `package.json` you'll see this dependency:

```
    "@loginshield/realm-client-browser": "^0.1.0",
```

The `@loginshield/realm-client-browser` is part of the LoginShield Enterprise SDK,
and you can see how it is used `src/views/Login.vue`.

# Developer setup

```
npm install
```

# Operation

There are two modes of operation for this test website:

1. Pre-configured Realm ID and Authorization Token, useful for testing realm logins
2. Auto-configured Realm ID and Authorization Token, useful for testing Webauthz and then realm logins

The steps to start the website are the same. The server configuration is different (see `test-enterprise-service-node-js`).

To test the pre-configured server, start with "Create Account", then activate LoginShield from
the account settings.

To test the auto-configured server, start with "Administrator Setup", then return to the front
page and continue with "Create Account", then activate LoginShield from the account settings.

The "Administrator Setup" steps would normally require an authenicated administrator in production.

## Environment variables

LISTEN_PORT
: where the service should accept connections
: an integer, e.g. `7102`
: required

LISTEN_IPADDR
: where the service should listen for connections
: an IPv4 address, e.g. `127.0.0.1`
: required

URL_HOST
: used to generate HTTP redirects to this service
: a hostname, e.g. `localhost`
: required

VUE_APP_SERVICE_ENDPOINT_URL
: used to connect to the service API
: an absolute URL, e.g. `https://localhost/service`
: required

VUE_APP_WEBSITE_PATH
: used to determine the main application path in the URL
: a path, e.g. `/`
: required

Linux:

```
export LISTEN_PORT=7102
export LISTEN_IPADDR=127.0.0.1
export URL_HOST=localhost
export VUE_APP_SERVICE_ENDPOINT_URL="http://$URL_HOST/service"
export VUE_APP_WEBSITE_PATH=/
```

Windows PowerShell:

```
$env:LISTEN_PORT="7102"
$env:LISTEN_IPADDR="127.0.0.1"
$env:URL_HOST="localhost"
$env:VUE_APP_SERVICE_ENDPOINT_URL="http://$env:URL_HOST/service"
$env:VUE_APP_WEBSITE_PATH="/"
```

## Start

Compiles and hot-reloads for development:

```
npm run serve
```

## Test

Check for syntax errors and auto-correct coding style:

```
npm run lint
```

Run all tests:

```
npm run test
```

Run only unit tests:

```
npm run test:unit
```

Run only end-to-end tests:

```
npm run test:e2e
```

# Production


Compiles and minifies for production:

```
npm run build
```


Build variants
--------------

We use `ifdef-loader` to build the project differently for development and testing or production.

References:

* https://github.com/neutrinojs/webpack-chain
