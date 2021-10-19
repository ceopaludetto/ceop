import type { Configuration, RuleSetRule, WebpackPluginInstance } from "webpack";

type BabelPlugins = (string | Record<string, any>)[];

export function findRuleByRegex(c: Configuration, regex: string, callback: (rule: RuleSetRule) => RuleSetRule) {
	if (c.module?.rules) {
		c.module.rules = c.module.rules.map((rule) => {
			if (typeof rule === "string") return rule;

			if (rule?.test?.toString()?.includes(regex)) {
				return callback(rule);
			}

			return rule;
		});
	}
}

export function addBabelPluginsOrPresets(c: Configuration, type: "plugins" | "presets", add: BabelPlugins) {
	findRuleByRegex(c, "tsx?", (rule) => {
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
	});
}

export function addRule(c: Configuration, rule: RuleSetRule) {
	c.module?.rules?.push(rule);
}

export function addPlugin(c: Configuration, plugin: WebpackPluginInstance) {
	c.plugins?.push(plugin);
}

export function addOptimization(c: Configuration, plugin: WebpackPluginInstance) {
	c.optimization?.minimizer?.push(plugin);
}
