const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const nodeExternals = require('webpack-node-externals');

module.exports = function (_env, argv) {
    const isProduction = argv.mode === "production";
    const isDevelopment = !isProduction;

    return [{
        devtool: isDevelopment && "cheap-module-source-map",
        entry: ["./src/index.tsx"],
        output: {
            path: path.resolve(__dirname, "dist", "public"),
            filename: "js/app.[name].js",
            publicPath: "/public"
        },
        devServer: {
            contentBase: './dist/public',
            historyApiFallback: true,
            hot: true,
            port: 9000
        },
        devtool: "source-map",
        module: {
            rules: [
                {
                    test: /\.(html)$/,
                    use: ["html-loader"]
                },
                {
                    test: /\.(tsx|ts)?$/,
                    loader: 'babel-loader',
                },
                {
                    test: /\.js$/,
                    use: ["source-map-loader"],
                    enforce: "pre"
                },
                {
                    test: /\.css|\.scss$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                        "css-loader",
                        "sass-loader"
                    ]
                },
                {
                    test: /\.(png|jpg|gif)$/i,
                    use: {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                            name: "static/media/[name].[hash:8].[ext]"
                        }
                    }
                },
                {
                    test: /\.svg$/,
                    use: ["@svgr/webpack"]
                }
            ]
        },
        resolve: {
            extensions: [".js", ".jsx",".tsx",".ts"]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "assets/css/[name].[contenthash:8].css",
                chunkFilename: "assets/css/[name].[contenthash:8].chunk.css"
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, "src", "html", "index.html")
            })
        ].filter(Boolean)
    },
    {
        entry: {
            server: "./src/server.tsx"
        },
        output: {
            filename: "[name].bundle.js",
            path: path.resolve(__dirname, "dist")
        },
        "target": "node",
        externals: [nodeExternals()],
        module: {
            rules: [
                {
                    test: /\.(js|jsx|tsx|ts)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        },
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx"]
        }
    },

    ]
};