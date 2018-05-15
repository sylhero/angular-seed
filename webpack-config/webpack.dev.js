const rules = require('./webpack.rules');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtPlugin = require('script-ext-html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/**
 * push dev rules into the default rules array
 */
// push vendor css rule
rules.push({
    test: /\.css$/,
    include: /(node_modules)/,
    use: [{
        loader: 'style-loader'
    }, {
        loader: 'css-loader'
    }]
});

// push app scss rule
rules.push({
    test: /\.scss$/,
    include: [path.resolve(__dirname, '../src')],
    use: [{
        loader: 'style-loader',
        options: {
            sourceMap: true
        }
    }, {
        loader: 'css-loader',
        options: {
            modules: true,
            importLoaders: 2,
            localIdentName: '[name]--[local]',
            sourceMap: true
        }
    }, {
        loader: 'postcss-loader'
    }, {
        loader: 'sass-loader'
    }]
});

module.exports = {
    entry: {
        app: [
            'react-hot-loader/patch',
            './src/index.jsx'
        ],
        vendor: [
            './src/Vendor.jsx'
        ]
    },
    devtool: 'eval',
    cache: true,
    output: {
        path: path.resolve(__dirname, '../app-build'),
        filename: 'js/[name].bundle.[hash].js',
        publicPath: '/'
    },
    mode: 'development',
    resolve: {
        extensions: [
            '.js',
            '.jsx',
            '.css',
            '.scss'
        ],
        modules: [
            path.resolve(__dirname, '../node_modules'),
            path.resolve(__dirname, '../src')
        ]
    },
    module: {
        rules
    },
    devServer: {
        contentBase: './app-build',
        noInfo: false,
        clientLogLevel: 'warning',
        stats: 'errors-only',
        // enable HMR depends on OS
        // https://github.com/gaearon/react-hot-loader/issues/511
        hot: true,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        // serve index.html in place of 404 responses to allow HTML5 history
        historyApiFallback: true,
        port: 4000,
        host: 'localhost'
    },
    /**
     * webpack 4 new optimization feature list
     * https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a
     * StyleLintPlugin is unknown
     */
    plugins: [
        // new BundleAnalyzerPlugin(),
        new StyleLintPlugin({
            failOnError: false,
            emitErrors: true,
            quiet: false,
            syntax: 'scss'
        }),
        new ScriptExtPlugin({
                defaultAttribute: 'defer'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: true,
            favicon: './src/assets/img/favicon.ico'
        })
    ]
};
