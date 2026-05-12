import { type Configuration as WebpackConfiguration } from "webpack";
import { type Configuration as WebpackDevConfiguration } from "webpack-dev-server";
import config from "./webpack.common.config";
import { merge } from "webpack-merge";
import path from "path";
import { fileURLToPath } from "url";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevConfiguration;
}

const devConfig: Configuration = merge(config, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    port: 9000,
    static: {
      directory: path.resolve(fileURLToPath(import.meta.url), "../../dist"),
    },
    devMiddleware: {
      index: "index.html",
      writeToDisk: true,
      publicPath: "/",
    },
    client: {
      overlay: true,
    },
    liveReload: true,
    historyApiFallback: true,
  },
});

export default devConfig;
