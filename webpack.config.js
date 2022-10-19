const path = require('path');
const { merge } = require('webpack-merge');
const postcssPresetEnv = require('postcss-preset-env');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');


const webpack = require('webpack');

const pages = ["index"];

const prod = {
    mode: 'production',

    output: {
        filename: 'js/[name].[contenthash].js',
    },

    optimization: {
        runtimeChunk: 'single',
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
            }),
            new CssMinimizerPlugin(),
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: (pathData) => {
                return pathData.chunk.name == 'vendors' ? "css/vendors[contenthash].css" : 'css/index[contenthash].css';
            }
        }),
    ],

    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [{ loader: MiniCssExtractPlugin.loader },
                {
                    loader: "css-loader",
                    options: {
                        importLoaders: 1,
                        sourceMap: true,
                        url: true
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [postcssPresetEnv({ browsers: '>= 0.5%, last 6 versions, Firefox ESR, not dead' })],
                        },
                    },
                },
                {
                    loader: "sass-loader",
                    options: {
                        sourceMap: true,
                    },
                },
                ],
            },

        ]
    },
};

const dev = {

    mode: 'development',

    output: {
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ReactRefreshPlugin({
            overlay: {
                sockIntegration: 'whm',
            },
        }),
    ].filter(Boolean),
};

const common = (options) => {

    const HtmlWebpackPlugins = pages.map((page) => new HtmlWebpackPlugin({
        inject: true,
        template: `src/assets/${page}.html`,
        filename: `${options.htmlPath}/${page}.html`,
        chunks: [page],
    }));

    return {
        devtool: "source-map",

        entry: pages.reduce((config, page) => {
            config[page] = options.isProduction ? `./src/${page}.tsx` : ['@gatsbyjs/webpack-hot-middleware/client', `./src/${page}.tsx`];
            return config;
        }, {}),

        output: {
            path: `${options.jsPath}`,
            publicPath: '/',
            assetModuleFilename: (pathData) => {
                let cleaned = pathData.module.rawRequest.replaceAll('../', '');
                return `${cleaned}`
            },
        },

        optimization: {
            splitChunks: {
                cacheGroups: {
                    common: {
                        test: /[\\/]src[\\/]js[\\/]/,
                        chunks: "all",
                        // chunks: (chunk) => true,
                        minSize: 0,
                        minChunks: 2,
                        name: (module) => {
                            return "common~" + module.userRequest.replace(module.context, "").replace("\\", "").replace(".js", "");
                        },
                    }

                },
            },
        },

        plugins: [
            ...HtmlWebpackPlugins,
            new ForkTsCheckerWebpackPlugin(),
            new CopyPlugin({
                patterns: [
                    {
                        from: "src/assets/img", to: "img", noErrorOnMissing: true,
                    },
                ]
            }),
        ],

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                }
            ],
        },

        resolve: {
            extensions: ['.js', '.ts', '.tsx'],
        },
    };
};

module.exports = function () {
    const isProduction = process.env.NODE_ENV == 'production';
    const htmlPath = process.env.SERVER ? '/' : path.resolve(__dirname, 'dist/');
    const jsPath = process.env.SERVER ? '/' : path.resolve(__dirname, 'dist/');
    const options = { htmlPath, jsPath, isProduction };

    if (isProduction) return merge(common(options), prod);
    return merge(common(options), dev);
};