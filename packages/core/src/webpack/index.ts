/* eslint-disable no-nested-ternary */
import { CeopConfiguration, Target, normalize, context } from "@ceop/utils";
// @ts-ignore
import StartServerWebpackPlugin from "razzle-start-server-webpack-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import Webpack, { Configuration } from "webpack";
import externals from "webpack-node-externals";

import { tsRule } from "./rules";

export function createConfiguration(target: Target, isDev: boolean, configuration: CeopConfiguration): Configuration {
	const entry: string[] = [];

	const isClient = target === "client";
	const isServer = target === "server";

	if (configuration.mode === "serveronly") {
		entry.push(normalize("src/index.ts"));
	}

	if (configuration.mode === "both") {
		if (isClient) entry.push(normalize("src/client/index.tsx"));
		if (isServer) entry.push(normalize("src/server/index.ts"));

		if (isServer && isDev) entry.unshift("webpack/hot/poll?300");
	}

	const publicPath = isDev ? "http://localhost:3001/" : "/";
	const outputPath = isClient ? normalize("dist/public") : normalize("dist");

	return {
		mode: isDev ? "development" : "production",
		target: isServer ? "node" : "web",
		bail: !isDev,
		externals: [isServer && externals({ allowlist: ["webpack/hot/poll?300"] })].filter(Boolean) as any,
		entry,
		context,
		stats: false,
		watch: !isDev,
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
			library: {
				type: isServer ? "commonjs2" : "var",
				name: isClient ? "client" : undefined,
			},
		},
		module: {
			rules: [tsRule(target)],
		},
		plugins: [
			isDev &&
				isServer &&
				new Webpack.HotModuleReplacementPlugin({
					multiStep: isClient,
				}),
			isDev && isServer && new StartServerWebpackPlugin({ killOnExit: true }),
		].filter(Boolean) as any,
		resolve: {
			extensions: [".js", ".jsx", ".ts", ".tsx"],
			plugins: [new TsconfigPathsPlugin({ configFile: normalize("tsconfig.json") })],
		},
		devServer:
			isDev && isClient
				? {
						compress: true,
						headers: { "Access-Control-Allow-Origin": "*" },
						hot: true,
						port: 3001,
						client: {
							logging: "none",
						},
						historyApiFallback: {
							disableDotRule: true,
						},
				  }
				: undefined,
	};
}
