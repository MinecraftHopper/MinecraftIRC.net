const path = require("path");
const webpack = require("webpack");

const config = {
    entry: "./js-src/app.js",
    output: {
        path: path.resolve(__dirname, "js"),
        filename: "app.js"
    },
    module: {
        rules: [
            {
                test: /.*\/app\/.*\.js$/,
                loader: "uglify-loader"
            },
            {
                test: /\.tag$/,
                exclude: /node_modules/,
                loader: 'riot-tag-loader',
                query: {
                    hot: false
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                    presets: ["latest"]
                }
            },
        ]
    },
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "js-src")
        ],
        alias: {
            jquery: "jquery/src/jquery",
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
    ]
};

module.exports = config;