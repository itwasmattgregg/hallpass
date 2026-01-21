"use strict";
const utils = require("./utils");
const webpack = require("webpack");
const config = require("../config");
const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const portfinder = require("portfinder");

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true,
    }),
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    client: {
      logging: "warn",
      overlay: config.dev.errorOverlay
        ? { warnings: false, errors: true }
        : false,
    },
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    static: {
      publicPath: config.dev.assetsPublicPath,
    },
    ...(Object.keys(config.dev.proxyTable).length > 0 && {
      proxy: config.dev.proxyTable,
    }),
    watchFiles: {
      options: {
        poll: config.dev.poll,
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": require("../config/dev.env"),
    }),
    new webpack.HotModuleReplacementPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      inject: true,
    }),
  ],
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // publish the new Port
      process.env.PORT = port;
      // add port to devServer config
      devWebpackConfig.devServer.port = port;

      resolve(devWebpackConfig);
    }
  });
});
