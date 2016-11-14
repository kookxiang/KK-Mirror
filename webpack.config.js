/* eslint-env node */
var fs = require("fs");
var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
    entry: "./index.jsx",
    output: {
        path: "dist/Resources",
        filename: "[name].[hash:8].js",
        publicPath: "/Resources/"
    },
    resolve: {
        extensions: ["", ".js", ".jsx"]
    },
    module: {
        loaders: [
            { test: /\.(sc|sa|c)ss$/, loader: ExtractTextPlugin.extract("style", "css?sourceMap&importLoaders=1&modules&camelCase&localIdentName=🌚[emoji]!postcss!sass") },
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "file?limit=8192&name=Asserts/[hash:hex:6].[ext]&minetype=application/font-woff" },
            { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "file?limit=8192&name=Asserts/[hash:hex:6].[ext]&minetype=application/font-woff" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file?limit=8192&name=Asserts/[hash:hex:6].[ext]&minetype=application/octet-stream" },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file?limit=8192&name=Asserts/[hash:hex:6].[ext]" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "file?limit=8192&name=Asserts/[hash:hex:6].[ext]&minetype=image/svg+xml" },
            { test: /\.(jpe?g|gif|png)$/, loader: "file?limit=8192&name=Asserts/[hash:hex:6].[ext]" },
            {
                test: /\.js|jsx$/,
                exclude: /node_modules/,
                loader: "babel",
                query: {
                    presets: ["es2015", "react"],
                    plugins: [
                        ["import", [
                            { libraryName: "react-toolbox", style: "sass" },
                            { libraryName: "react-router", camel2DashComponentName: false },
                        ]], "add-module-exports", "transform-runtime"
                    ]
                }
            }
        ]
    },
    sassLoader: {
        data: "@import \"" + path.resolve(__dirname, "css/_theme.scss") + "\";"
    },
    postcss: function () {
        return [
            require("autoprefixer")({
                browsers: ["ie >= 9", "> 2%", "last 1 version"]
            })
        ];
    },
    plugins: [
        new CleanWebpackPlugin(["dist"], { root: __dirname }),
        new ExtractTextPlugin("[name].[hash:8].css"),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            comments: false,
            sourceMap: false
        }),
        function () {
            this.plugin("done", function (stats) {
                let hash = stats.hash.substr(0, 8);
                let out = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
                out = out.replace(new RegExp("main.js", "g"), `main.${hash}.js`);
                out = out.replace(new RegExp("main.css", "g"), `main.${hash}.css`);
                fs.writeFileSync(path.join(__dirname, "dist/index.html"), out);
            });
        }
    ]
};
