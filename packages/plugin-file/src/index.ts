import type { Plugin } from "@ceop/utils";
import type { RuleSetRule } from "webpack-node-externals/node_modules/webpack";

const plugin: Plugin = (configuration, { target, isDev }) => {
	if (configuration.module?.rules) {
		const { rules } = configuration.module;

		configuration.module.rules = [
			{
				oneOf: [
					...(rules as RuleSetRule[]),
					{
						exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.json$/],
						type: "asset",
						parser: {
							dataUrlCondition: {
								maxSize: 10 * 1024, // 10kb
							},
						},
						generator: {
							emit: target === "client",
						},
					},
				],
			},
		];
	}

	return configuration;
};

export default plugin;
