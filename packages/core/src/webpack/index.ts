/* eslint-disable no-nested-ternary */
import { CeopConfiguration, Target, normalize, context } from "@ceop/utils";
// @ts-ignore
import StartServerPlugin from "razzle-start-server-webpack-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import Webpack, { Configuration } from "webpack";
import externals from "webpack-node-externals";

import { getEnv } from "./env";
import { tsRule } from "./rules";

export function createConfiguration(target: Target, configuration: CeopConfiguration, devPort: number): Configuration {
	const entry: string[] = [];

	const isDev = process.env.NODE_ENV !== "production";
	const isClient = target === "client";
	const isServer = target === "server";

	if (configuration.mode === "serveronly") {
		entry.push(normalize("src/index.ts"));
	}

	if (configuration.mode === "both") {
		if (isClient) entry.push(normalize("src/client/index.tsx"));
		if (isServer) entry.push(normalize("src/server/index.ts"));

		if (isServer && isDev) {
			entry.unshift(`${require.resolve("webpack/hot/poll")}?300`);
			entry.unshift(require.resolve("@ceop/mute-hmr"));
		}
	}

	const publicPath = isDev ? `http://localhost:${devPort}/` : "/";
	const outputPath = isClient ? normalize("dist/public") : normalize("dist");

	const env = getEnv();

	return {
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
			rules: [tsRule(target, isDev)],
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
			new Webpack.DefinePlugin(env),
		].filter(Boolean) as any,
		resolve: {
			extensions: [".js", ".jsx", ".ts", ".tsx"],
			plugins: [new TsconfigPathsPlugin({ configFile: normalize("tsconfig.json") })],
		},
		devServer:
			isClient && isDev
				? {
						compress: true,
						headers: { "Access-Control-Allow-Origin": "*" },
						hot: true,
						port: devPort,
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
