var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: "./index.jsx",
    output: {
        path: "dist",
        filename: "[name].js",
        sourceMapFilename: "[file].map"
    },
    resolve: {
        extensions: ["", ".js", ".jsx"]
    },
    module: {
        loaders: [
            { test: /\.(sc|sa|c)ss$/, loader: ExtractTextPlugin.extract("style", "css?sourceMap&importLoaders=1&modules&camelCase&localIdentName=[path][name][local]_[hash:base64:6]!postcss!sass") },
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "file?limit=8192&name=assert/[hash:hex:6].[ext]&minetype=application/font-woff" },
            { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "file?limit=8192&name=assert/[hash:hex:6].[ext]&minetype=application/font-woff" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file?limit=8192&name=assert/[hash:hex:6].[ext]&minetype=application/octet-stream" },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "file?limit=8192&name=assert/[hash:hex:6].[ext]&minetype=image/svg+xml" },
            { test: /\.(jpe?g|gif|png)$/, loader: "file?limit=8192&name=assert/[hash:hex:6].[ext]" },
            {
                test: /\.js|jsx$/,
                exclude: /node_modules/,
                loader: "babel",
                query: {
                    presets: ["es2015", "react"],
                    plugins: [
                        ["import", { libraryName: "react-toolbox", style: "sass" }], "add-module-exports", "transform-runtime"
                    ]
                }
            }
        ]
    },
    sassLoader: {
        data: "@import \"" + path.resolve(__dirname, "css/_theme.scss") + "\";"
    },
    postcss: function () {
        return [];
    },
    sourceMap: "cheap-source-map",
    plugins: [
        new ExtractTextPlugin("[name].css"),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("dev")
        })
    ]
};
