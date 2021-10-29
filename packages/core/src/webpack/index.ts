/* eslint-disable no-nested-ternary */
import { CeopConfiguration, Target, normalize, context, applyPlugins } from "@ceop/utils";
// @ts-ignore
import StartServerPlugin from "razzle-start-server-webpack-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import Webpack, { Configuration } from "webpack";
import externals from "webpack-node-externals";

import { getEnv } from "./env";
import { tsRule } from "./rules";

export interface ConfigurationOptions {
	browserslist: string[];
	devPort: number;
	port: number;
	target: Target;
}

export async function createConfiguration(
	configuration: CeopConfiguration,
	options: ConfigurationOptions,
): Promise<Configuration> {
	const { target, devPort, port, browserslist } = options;

	const entry: string[] = [];

	const isDev = process.env.NODE_ENV !== "production";
	const isClient = target === "client";
	const isServer = target === "server";

	if (configuration.mode === "serveronly") {
		entry.push(normalize("src/index.ts"));
	}

	if (configuration.mode === "both") {
		if (isClient) entry.push(normalize(configuration.entry.client));
		if (isServer) entry.push(normalize(configuration.entry.server));

		if (isServer && isDev) {
			entry.unshift(`${require.resolve("webpack/hot/poll")}?300`);
			entry.unshift(require.resolve("@ceop/mute-hmr"));
		}
	}

	const publicPath = isDev ? `http://localhost:${devPort}/` : "/";
	const outputPath = isClient ? normalize("dist/public") : normalize("dist");

	const env = getEnv();

	let webpackConfiguration: Configuration = {
		mode: isDev ? "development" : "production",
		target: isServer ? "node" : "web",
		bail: !isDev,
		externals: [isServer && externals({ allowlist: ["webpack/hot/poll?300"] })].filter(Boolean) as any,
		devtool: isDev ? "eval-source-map" : "source-map",
		entry,
		context,
		watch: !isDev,
		stats: "none",
		infrastructureLogging: {
			level: "none",
		},
		optimization: {
			minimize: !isDev,
			minimizer: [
				new TerserWebpackPlugin({
					parallel: true,
					terserOptions: {
						toplevel: true,
						format: {
							comments: false,
						},
					},
				}),
			],
		},
		output: {
			path: outputPath,
			publicPath,
			pathinfo: isClient,
			filename: isClient ? (isDev ? "static/js/[name].js" : "static/js/[name].[contenthash:8].js") : "[name].js",
			chunkFilename: isClient
				? isDev
					? "static/js/[name].chunk.js"
					: "static/js/[name].[contenthash:8].chunk.js"
				: "[name].chunk.js",
			assetModuleFilename: isDev ? "static/media/[name][ext]" : "static/media/[name].[contenthash:8][ext]",
			library: {
				type: isServer ? "commonjs2" : "var",
				name: isClient ? "client" : undefined,
			},
		},
		module: {
			rules: [tsRule(target, isDev, browserslist)],
		},
		plugins: [
			isDev && new Webpack.HotModuleReplacementPlugin(),
			isDev &&
				isServer &&
				new StartServerPlugin({
					nodeArgs: ["-r", require.resolve("source-map-support/register")],
					killOnExit: false,
					killOnError: false,
					verbose: false,
					debug: false,
					inject: false,
				}),
			!isDev && isClient && new Webpack.optimize.AggressiveMergingPlugin(),
			!isDev &&
				isServer &&
				new Webpack.optimize.LimitChunkCountPlugin({
					maxChunks: 1,
				}),
			new Webpack.EnvironmentPlugin({ PORT: port, ...env }),
		].filter(Boolean) as any,
		resolve: {
			extensions: [".js", ".jsx", ".ts", ".tsx"],
			plugins: [new TsconfigPathsPlugin({ configFile: normalize("tsconfig.json") })],
		},
	};

	webpackConfiguration = await applyPlugins(configuration, webpackConfiguration, { target, browserslist, isDev });
	return webpackConfiguration;
}
