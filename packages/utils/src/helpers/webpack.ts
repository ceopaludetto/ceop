import type { Configuration, RuleSetRule, WebpackPluginInstance } from "webpack";

export function findRuleByRegex(regex: string, callback: (rule: RuleSetRule) => RuleSetRule) {
	return (configuration: Configuration) => {
		if (configuration.module?.rules) {
			configuration.module.rules = configuration.module.rules.map((rule) => {
				if (typeof rule === "string") return rule;

				if (rule?.test?.toString()?.includes(regex)) {
					return callback(rule);
				}

				return rule;
			});
		}
	};
}

export function addBabelPluginsOrPresets(type: "plugins" | "presets", add: (string | [string, Record<string, any>])[]) {
	return (configuration: Configuration) => {
		findRuleByRegex("tsx?", (rule) => {
			if (rule?.use && Array.isArray(rule.use)) {
				if (typeof rule.use[0] === "object") {
					const options = typeof rule.use[0]?.options === "object" ? rule.use[0]?.options : {};

					rule.use[0] = {
						...rule?.use[0],
						options: {
							...options,
							plugins: [...(options?.plugins ?? []), ...(type === "plugins" ? add : [])],
							presets: [...(options?.presets ?? []), ...(type === "presets" ? add : [])],
						},
					};
				}
			}

			return rule;
		})(configuration);
	};
}

export function addRule(rule: RuleSetRule) {
	return (configuration: Configuration) => {
		configuration.module?.rules?.push(rule);
	};
}

export function addPlugin(plugin: WebpackPluginInstance) {
	return (configuration: Configuration) => {
		configuration.plugins?.push(plugin);
	};
}
