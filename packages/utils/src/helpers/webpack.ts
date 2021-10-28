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
			const index = rule.use.findIndex((use) => {
				if (typeof use === "string") {
					return use === "babel-loader";
				}

				if (typeof use === "object") {
					return use.loader === "babel-loader";
				}

				return false;
			});

			if (index < 0) throw new Error("babel-loader not found");

			const loader = rule.use[index];
			if (typeof loader === "object") {
				const options = typeof loader?.options === "object" ? loader?.options : {};

				rule.use[index] = {
					...loader,
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
