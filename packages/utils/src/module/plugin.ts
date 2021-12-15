import type { Configuration } from "webpack";

import type { CeopConfiguration } from "../helpers/validation";
import type { Plugin, IPluginOptions } from "../types";
import { resolve } from "./path";

export async function getPlugins(configuration: CeopConfiguration): Promise<Plugin[]> {
	if (configuration?.plugins?.length) {
		return Promise.all(
			configuration.plugins.map(async (plugin) => {
				if (typeof plugin === "function") {
					return plugin;
				}

				try {
					return resolve<Plugin>(plugin);
				} catch (error) {
					throw new Error(`Plugin ${plugin} not found`);
				}
			}),
		);
	}

	return [];
}

export async function applyPlugins(
	ceopConfiguration: CeopConfiguration,
	configuration: Configuration,
	options: IPluginOptions,
): Promise<Configuration> {
	const plugins = await getPlugins(ceopConfiguration);

	for (const plugin of plugins) {
		configuration = plugin(configuration, options);
	}

	return configuration;
}
