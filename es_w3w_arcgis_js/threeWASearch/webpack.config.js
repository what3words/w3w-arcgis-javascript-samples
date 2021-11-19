const path = require("path");
const Dotenv = require('dotenv-webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
    entry: {
        index: [
            "./src/threeWASearch.js",
            "./src/threeWASearch.css"
        ]
    },
    node: false,
    output: {
        path: path.join(__dirname, 'dist'),
        chunkFilename: 'chunks/[id].js',
        publicPath: '',
        clean: true
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 3001,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            title: 'ArcGIS API  for JavaScript',
            template: './public/index.html',
            filename: './index.html',
            chunksSortMode: 'none',
            inlineSource: '.(css)$'
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[chunkhash].css",
            chunkFilename: "[id].css"
        }),
        new Dotenv({
            path: './.env', // Path to .env file (this is the default)
            safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe)
          }),
    ],
};