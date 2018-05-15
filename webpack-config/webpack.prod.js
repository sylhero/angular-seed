const rules = require('./webpack.rules');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ScriptExtPlugin = require('script-ext-html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
/**
 * push prod rules into the default rules array
 */

// push vendor css rule
rules.push({
    test: /\.css$/,
    include: /(node_modules)/,
    use: [MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            options: {
                minimize: true
            }
        }]
});

// push app css rule
rules.push({
    test: /\.scss$/,
    include: [path.resolve(__dirname, '../src')],
    use: [MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            options: {
                modules: true,
                localIdentName: '[name]--[local]',
                importLoaders: 2,
                minimize: true
            }
        }, {
            loader: 'postcss-loader'
        }, {
            loader: 'sass-loader'
        }]
});


// webpack config
module.exports = {
    entry: {
        app: [
            './src/index.jsx'
        ],
        vendor: [
            './src/Vendor.jsx'
        ]
    },
    devtool: 'cheap-source-map',
    // use hash to leverage the browser cache
    output: {
        path: path.resolve(__dirname, '../app-build'),
        filename: 'js/[name].bundle.[hash].js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.scss'],
        modules: ['node_modules', 'js', 'styles', 'assets', 'assets/img', 'assets/font']

    },
    mode: 'production',
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        }
    },
    module: {
        rules
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new ScriptExtPlugin({
                defaultAttribute: 'defer'
        }),
        new StyleLintPlugin({
            failOnError: true,
            emitErrors: true,
            quiet: false,
            syntax: 'scss'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: true,
            favicon: './src/assets/img/favicon.ico'
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].[hash].css'
        })
    ]
};
