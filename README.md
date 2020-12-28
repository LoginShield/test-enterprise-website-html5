website-test-enterprise-html5
=============================

To run the test service locally, you'll need to:

1. Follow directions in [Developer setup]
2. Set the [Environment variables]
3. Follow directions in [Start] for this service

# Developer setup

```
npm install
```

# Operation

## Environment variables

LISTEN_PORT
: where the service should accept connections
: an integer, e.g. `7100`
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
