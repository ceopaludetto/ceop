import { addPlugin, Plugin } from "@ceop/utils";
// @ts-ignore
import CompressionWebpackPlugin from "compression-webpack-plugin";
import zlib from "zlib";

const plugin: Plugin = (configuration, { target, isDev }) => {
	if (target === "client" && !isDev) {
		addPlugin(
			configuration,
			new CompressionWebpackPlugin({
				filename: "[path][base].gz",
				algorithm: "gzip",
				test: /\.(js|css)$/,
			}),
		);

		addPlugin(
			configuration,
			new CompressionWebpackPlugin({
				filename: "[path][base].br",
				algorithm: "brotliCompress",
				test: /\.(js|css)$/,
				compressionOptions: {
					params: {
						[zlib.constants.BROTLI_PARAM_QUALITY]: 11,
					},
				},
			}),
		);
	}

	return configuration;
};

export default plugin;
