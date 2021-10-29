import type { Plugin } from "@ceop/utils";
import type { RuleSetRule } from "webpack-node-externals/node_modules/webpack";

const plugin: Plugin = (configuration, { isDev, target }) => {
	if (configuration.module?.rules) {
		const { rules } = configuration.module;

		configuration.module.rules = [
			{
				oneOf: [
					...(rules as RuleSetRule[]),
					{
						loader: "file-loader",
						options: {
							name: isDev ? "[name].[ext]" : "[name].[contenthash:8].[ext]",
							emitFile: !isDev && target === "client",
						},
					},
				],
			},
		];
	}

	return configuration;
};

export default plugin;
