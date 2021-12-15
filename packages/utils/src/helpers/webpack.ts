import type { Configuration, RuleSetRule, WebpackPluginInstance } from "webpack";

type BabelPlugins = (string | Record<string, any>)[];

export function findRuleByRegex(
	c: Configuration,
	regex: string,
	callback: (rule: RuleSetRule) => RuleSetRule,
): Configuration {
	if (c.module?.rules) {
		c.module.rules = c.module.rules.map((rule) => {
			if (typeof rule === "string") return rule;

			if (rule?.test?.toString()?.includes(regex)) {
				return callback(rule);
			}

			return rule;
		});
	}

	return c;
}

export function addBabelPluginsOrPresets(
	c: Configuration,
	type: "plugins" | "presets",
	add: BabelPlugins,
): Configuration {
	return findRuleByRegex(c, "tsx?", (rule) => {
		if (rule?.use && Array.isArray(rule.use)) {
			const index = rule.use.findIndex((use) => {
				if (typeof use === "string") {
					return use.includes("babel-loader");
				}

				if (typeof use === "object") {
					return use.loader?.includes("babel-loader");
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

			if (typeof loader === "string") {
				rule.use[index] = {
					loader,
					options: {
						plugins: [...(type === "plugins" ? add : [])],
						presets: [...(type === "presets" ? add : [])],
					},
				};
			}
		}

		return rule;
	});
}

export function removeBabelPluginsOrPresets(
	c: Configuration,
	type: "plugins" | "presets",
	search: string,
): Configuration {
	return findRuleByRegex(c, "tsx?", (rule) => {
		if (rule?.use && Array.isArray(rule.use)) {
			const index = rule.use.findIndex((use) => {
				if (typeof use === "string") {
					return use.includes("babel-loader");
				}

				if (typeof use === "object") {
					return use.loader?.includes("babel-loader");
				}

				return false;
			});

			if (index < 0) throw new Error("babel-loader not found");

			const loader = rule.use[index];
			if (typeof loader === "object") {
				const options = typeof loader?.options === "object" ? loader?.options : {};

				const itemIndex = options[type].findIndex((item: string | any[]) => {
					if (Array.isArray(item)) return item[0].includes(search);

					return item.includes(search);
				});

				if (itemIndex < 0) throw new Error(`plugin or preset ${search} not found`);

				delete options[type][itemIndex];
				options[type] = options[type].filter(Boolean);

				rule.use[index] = {
					...loader,
					options,
				};
			}
		}

		return rule;
	});
}

export function addRule(c: Configuration, rule: RuleSetRule): Configuration {
	c.module?.rules?.push(rule);
	return c;
}

export function addPlugin(c: Configuration, plugin: WebpackPluginInstance): Configuration {
	c.plugins?.push(plugin);
	return c;
}

export function addOptimization(c: Configuration, plugin: WebpackPluginInstance): Configuration {
	c.optimization?.minimizer?.push(plugin);
	return c;
}
