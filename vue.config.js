const ifdefOptions = {
    production: process.env.NODE_ENV === 'production',
    'ifdef-verbose': false,
    'ifdef-triple-slash': false, // because eslint "corrects" a triple slash to a double slash, space, then single slash
};

// https://webpack.js.org/concepts/loaders/#configuration
// https://github.com/nippur72/ifdef-loader
// https://webpack.js.org/configuration/dev-server/
module.exports = {
    devServer: {
        host: process.env.HOST || 'localhost',
        public: process.env.HOST || 'localhost',
        sockHost: process.env.HOST || 'localhost',
        sockPort: process.env.HOST ? 443 : 8080,
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
