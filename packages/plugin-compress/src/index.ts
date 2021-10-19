import { addPlugin, Plugin } from "@ceop/utils";
import CompressionWebpackPlugin from "compression-webpack-plugin";
import zlib from "zlib";

const plugin: Plugin = (configuration, { target }) => {
	if (target === "client") {
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
				algorithm: "brotliCompress" as any,
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
