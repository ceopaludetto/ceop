import type { Plugin } from "@ceop/utils";
import type { RuleSetRule } from "webpack-node-externals/node_modules/webpack";

const plugin: Plugin = (configuration) => {
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
					},
				],
			},
		];
	}

	return configuration;
};

export default plugin;
