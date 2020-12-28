const ifdefOptions = {
    production: process.env.NODE_ENV === 'production',
    'ifdef-verbose': false,
    'ifdef-triple-slash': false, // because eslint "corrects" a triple slash to a double slash, space, then single slash
};

// https://webpack.js.org/concepts/loaders/#configuration
// https://github.com/nippur72/ifdef-loader
// https://webpack.js.org/configuration/dev-server/
module.exports = {
    publicPath: process.env.VUE_APP_WEBSITE_PATH || '/',
    devServer: {
        port: process.env.LISTEN_PORT || '80',
        host: process.env.LISTEN_IPADDR || '127.0.0.1',
        public: process.env.URL_HOST || 'localhost',
        allowedHosts: [
            process.env.URL_HOST,
        ],
        watchOptions: {
            ignored: [/node_modules/],
        },
    },
    configureWebpack: (config) => {
        config.module.rules.push({
            test: /\.(vue|js)$/,
            exclude: /node_modules/,
            use: [
                { loader: 'ifdef-loader', options: ifdefOptions },
            ],
        });
    },
};
