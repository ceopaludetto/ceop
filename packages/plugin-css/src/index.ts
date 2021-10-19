import { addRule, addPlugin, Plugin } from "@ceop/utils";
// @ts-ignore
import MiniCssPlugin from "mini-css-extract-plugin";
import type { RuleSetUseItem } from "webpack";

const plugin: Plugin = (configuration, { target, isDev, browserslist }) => {
	const loaders = (modules: boolean) =>
		[
			isDev && target === "client" && require.resolve("style-loader"),
			modules && target === "client" && require.resolve("css-modules-typescript-loader"),
			!isDev && target === "client" && MiniCssPlugin.loader,
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
								},
							],
						],
					},
				},
			},
			{ loader: require.resolve("resolve-url-loader"), options: { sourceMap: isDev } },
			{ loader: require.resolve("sass-loader"), options: { implementation: require.resolve("sass"), sourceMap: true } },
		].filter(Boolean) as RuleSetUseItem[];

	addRule(configuration, {
		test: /\.s?css$/,
		exclude: /\.module\.s?css$/,
		use: loaders(false),
	});

	addRule(configuration, {
		test: /\.module\.s?css$/,
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

	return configuration;
};

export default plugin;
