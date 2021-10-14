import { normalize, Target } from "@ceop/utils";

export const tsRule = (target: Target) => ({
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
				],
			},
		},
		{ loader: require.resolve("ts-loader"), options: { configFile: normalize("tsconfig.json") } },
	],
});
