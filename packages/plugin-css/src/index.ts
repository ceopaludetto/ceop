import { addRule, addPlugin, addOptimization, Plugin } from "@ceop/utils";
// @ts-ignore
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
// @ts-ignore
import MiniCssPlugin from "mini-css-extract-plugin";
import type { RuleSetUseItem } from "webpack";

const plugin: Plugin = (configuration, { target, isDev, browserslist }) => {
	const loaders = (modules: boolean) =>
		[
			isDev && target === "client" && require.resolve("style-loader"),
			!isDev && target === "client" && MiniCssPlugin.loader,
			modules && target === "client" && require.resolve("css-modules-typescript-loader"),
			{
				loader: require.resolve("css-loader"),
				options: {
					importLoaders: 3,
					sourceMap: isDev,
					modules: modules
						? {
								auto: true,
								exportOnlyLocals: target === "server",
								localIdentName: isDev ? "[path][name]__[local]--[hash:base64:5]" : "_[hash:base64:5]",
						  }
						: undefined,
				},
			},
			{
				loader: require.resolve("postcss-loader"),
				options: {
					sourceMap: isDev,
					postcssOptions: {
						plugins: [
							[
								require.resolve("postcss-preset-env"),
								{
									stage: 3,
									browsers: browserslist,
									features: {
										"nesting-rules": true,
									},
								},
							],
						],
					},
				},
			},
		].filter(Boolean) as RuleSetUseItem[];

	addRule(configuration, {
		test: /\.css$/,
		exclude: /\.module\.css$/,
		use: loaders(false),
	});

	addRule(configuration, {
		test: /\.module\.css$/,
		use: loaders(true),
	});

	if (target === "client" && !isDev) {
		addPlugin(
			configuration,
			new MiniCssPlugin({
				filename: "static/css/[name].css",
				chunkFilename: "static/css/[name].chunk.css",
			}),
		);
	}

	addOptimization(
		configuration,
		new CssMinimizerPlugin({
			parallel: true,
			minimizerOptions: {
				preset: [
					"default",
					{
						discardComments: { removeAll: true },
					},
				],
			},
		}),
	);

	return configuration;
};

export default plugin;
