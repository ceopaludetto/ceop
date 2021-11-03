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
	return c;
}

export function addBabelPluginsOrPresets(c: Configuration, type: "plugins" | "presets", add: BabelPlugins) {
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

export function removeBabelPluginsOrPresets(c: Configuration, type: "plugins" | "presets", search: string) {
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

				if (type === "plugins" && options?.plugins) {
					const pluginIndex = options.plugins.findIndex((plugin: string | any[]) => {
						if (Array.isArray(plugin)) return plugin[0] === search;

						return plugin === search;
					});

					if (pluginIndex < 0) throw new Error(`plugin ${search} not found`);

					delete options.plugins[pluginIndex];
				}

				if (type === "presets" && options?.presets) {
					const pluginIndex = options.presets.findIndex((preset: string | any[]) => {
						if (Array.isArray(preset)) return preset[0] === search;

						return preset === search;
					});

					if (pluginIndex < 0) throw new Error(`preset ${search} not found`);

					delete options.presets[pluginIndex];
				}

				rule.use[index] = {
					...loader,
					options,
				};
			}
		}

		return rule;
	});
}

export function addRule(c: Configuration, rule: RuleSetRule) {
	c.module?.rules?.push(rule);
	return c;
}

export function addPlugin(c: Configuration, plugin: WebpackPluginInstance) {
	c.plugins?.push(plugin);
	return c;
}

export function addOptimization(c: Configuration, plugin: WebpackPluginInstance) {
	c.optimization?.minimizer?.push(plugin);
	return c;
}
