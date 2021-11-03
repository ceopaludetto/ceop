import { findRuleByRegex, normalize, Plugin, removeBabelPluginsOrPresets } from "@ceop/utils";

const plugin: Plugin = (configuration) => {
	removeBabelPluginsOrPresets(configuration, "presets", "@babel/preset-typescript");
	findRuleByRegex(configuration, "tsx?", (rule) => {
		if (Array.isArray(rule.use)) {
			rule.use.push({
				loader: require.resolve("ts-loader"),
				options: { transpileOnly: true, configFile: normalize("tsconfig.json") },
			});
		}

		return rule;
	});

	return configuration;
};

export default plugin;
