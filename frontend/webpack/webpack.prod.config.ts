import { Configuration } from "webpack";
import config from "./webpack.common.config";
import { merge } from "webpack-merge";

const prodConfig: Configuration = merge(config, {
  mode: "production",
});

export default prodConfig;
