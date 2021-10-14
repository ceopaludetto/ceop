import type { Configuration } from "webpack";

import type { CeopConfiguration } from "../helpers/validation";
import type { Plugin, Target } from "../types";
import { resolve, exists } from "./path";

export async function getPlugins(configuration: CeopConfiguration) {
	if (configuration?.plugins?.length) {
		return Promise.all(
			configuration.plugins.map(async (plugin) => {
				if (!(await exists(plugin))) {
					throw new Error(`Plugin ${plugin} not found`);
				}

				return resolve<Plugin>(plugin);
			}),
		);
	}

	return [];
}

export async function applyPlugins(
	ceopConfiguration: CeopConfiguration,
	configuration: Configuration,
	target: Target,
	isDev: boolean,
) {
	const plugins = await getPlugins(ceopConfiguration);

	for (const plugin of plugins) {
		configuration = plugin(configuration, target, isDev);
	}

	return configuration;
}
