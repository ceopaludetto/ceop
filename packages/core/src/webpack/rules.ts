import type { Target } from "@ceop/utils";
import path from "path";

export const tsRule = (target: Target, isDev: boolean) => ({
	test: /\.tsx?$/,
	exclude: /node_modules/,
	use: [
		{
			loader: require.resolve("babel-loader"),
			options: {
				presets: [
					[
						require.resolve("@babel/preset-env"),
						{
							targets: target === "client" ? undefined : { node: "current" },
							useBuiltIns: "usage",
							corejs: 3,
						},
					],
					[require.resolve("@babel/preset-react"), { runtime: "automatic" }],
					[require.resolve("@babel/preset-typescript"), { allowNamespaces: true, allExtensions: true, isTSX: true }],
				],
				plugins: [
					target === "client" && [
						require.resolve("@babel/plugin-transform-runtime"),
						{
							corejs: false,
							helpers: true,
							regenerator: true,
							absoluteRuntime: path.dirname(require.resolve("@babel/runtime/package.json")),
							// eslint-disable-next-line global-require
							version: require("@babel/runtime/package.json").version,
						},
					],
					!isDev && [
						require.resolve("babel-plugin-transform-react-remove-prop-types"),
						{
							removeImport: true,
						},
					],
				].filter(Boolean),
			},
		},
	],
});
